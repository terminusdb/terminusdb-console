"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs2/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.HistoryNavigator = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/esm/slicedToArray"));

var _parseFloat2 = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/parse-float"));

var _react = _interopRequireWildcard(require("react"));

var _dateFns = require("date-fns");

var _reactstrap = require("reactstrap");

var _BranchSelector = _interopRequireDefault(require("./BranchSelector"));

var _DateTimeSlider = require("./DateTimeSlider");

var _CommitView = _interopRequireDefault(require("./CommitView"));

var _terminusClient = _interopRequireDefault(require("@terminusdb/terminus-client"));

var _woqlClientInstance = require("../../init/woql-client-instance");

/**
 * The history navigator is a UI widget which allows a user to change their branch and time to view the database at
 * any specific time / branch
 */
var HistoryNavigator = function HistoryNavigator(props) {
  /*to be review*/
  var _WOQLClientObj = (0, _woqlClientInstance.WOQLClientObj)(),
      woqlClient = _WOQLClientObj.woqlClient;

  var dbClient = woqlClient;
  if (dbClient.db() == "terminus") return null;
  var nowts = props.now || (0, _parseFloat2["default"])((0, _dateFns.startOfHour)((0, _dateFns.addHours)(new Date(), 1)).getTime() / 1000);
  var timelinemin = props.start || (0, _parseFloat2["default"])((0, _dateFns.subDays)((0, _dateFns.startOfToday)(), 7).getTime() / 1000);

  var _useState = (0, _react.useState)(props.branches),
      _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
      branches = _useState2[0],
      setBranches = _useState2[1];

  var _useState3 = (0, _react.useState)(props.ref),
      _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
      ref = _useState4[0],
      setRef = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
      settingCommit = _useState6[0],
      setSettingCommit = _useState6[1];

  var _useState7 = (0, _react.useState)(nowts),
      _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
      end = _useState8[0],
      setEnd = _useState8[1];

  var _useState9 = (0, _react.useState)(nowts),
      _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
      current = _useState10[0],
      setCurrent = _useState10[1];

  var _useState11 = (0, _react.useState)(),
      _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
      currentCommit = _useState12[0],
      setCommit = _useState12[1];

  var _useState13 = (0, _react.useState)(props.branch || dbClient.checkout()),
      _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
      branch = _useState14[0],
      setBranch = _useState14[1];

  var _useState15 = (0, _react.useState)({
    first: timelinemin,
    count: 0
  }),
      _useState16 = (0, _slicedToArray2["default"])(_useState15, 2),
      branchInfo = _useState16[0],
      setBranchInfo = _useState16[1]; // no history for terminus (master) db
  //retrieves details of the available branches


  (0, _react.useEffect)(function () {
    var q = _terminusClient["default"].WOQL.lib().loadBranchNames(dbClient);

    dbClient.query(q).then(function (results) {
      var wr = new _terminusClient["default"].WOQLResult(results, q);
      var bchoices = [];
      var res;

      while (res = wr.next()) {
        bchoices.push({
          value: res['BranchName']["@value"],
          label: res['BranchName']["@value"]
        });
      }

      setBranches(bchoices);
    });
  }, []); //retrieves details of the branch, only when the branch is changed

  (0, _react.useEffect)(function () {
    //alert("loading branch info for " + branch)
    var q = _terminusClient["default"].WOQL.lib().loadBranchLimits(dbClient);

    dbClient.query(q).then(function (results) {
      var wr = new _terminusClient["default"].WOQLResult(results, q);
      var res = wr.first();
      setBranchInfo({
        id: dbClient.checkout(),
        last: res['Last']['@value'],
        first: res['First']['@value'] || res['Last']['@value'],
        head: res['HeadID']["@value"],
        count: res['Path'] && (0, _isArray["default"])(res['Path']) ? res['Path'].length : 1,
        uri_prefix: res['Base_URI']['@value']
      });
      setRef(res['HeadID']["@value"]);
      if (props.setCreated) props.setCreated(res['First']['@value'] || res['Last']['@value']);
    });
  }, [branch]); //retrieves details of the commit with id ref

  (0, _react.useEffect)(function () {
    if (ref) {
      var q2 = _terminusClient["default"].WOQL.lib().loadCommitDetails(dbClient, ref);

      dbClient.query(q2).then(function (cresults) {
        var cwr = new _terminusClient["default"].WOQLResult(cresults, q2);
        var cres = cwr.first();
        var commie = extractCommitData(cres);
        commie.id = ref;

        if (settingCommit) {
          setCurrent(commie.time);
          setSettingCommit(false);
          if (props.onHeadChange) props.onHeadChange();
        }

        if (props.setCommitInfo) props.setCommitInfo(commie);
        setCommit(commie);
      });
    }
  }, [ref]); //retrieves details of the previous commit, only when user changes time

  function userChangesTime(ts) {
    if (ts && Math.floor(current) != Math.floor(ts)) {
      setCurrent(ts);
      var fts = String(ts);

      var q3 = _terminusClient["default"].WOQL.lib().loadCommitBefore(dbClient, fts);

      dbClient.query(q3).then(function (lresults) {
        var lwr = new _terminusClient["default"].WOQLResult(lresults, q3);
        var lres = lwr.first();

        if (lres) {
          var commie = extractCommitData(lres);

          if (commie.child) {
            dbClient.ref(commie.id);
          } else dbClient.ref(false);

          if (!currentCommit || commie.id != currentCommit.id) {
            setCommit(commie);
            if (props.onHeadChange) props.onHeadChange();
            if (props.setCommitInfo) props.setCommitInfo(commie);
          }
        }
      });
    }
  } //change the commit and change the time on the timeline to the commit time


  function userChangesCommit(cid) {
    setSettingCommit(true);
    setRef(cid);
  } //change the commit and change the time on the timeline to the commit time


  function userCreatesBranch(bid) {
    //if(!dbClient.ref()) dbClient.ref(ref)
    dbClient.branch(bid, branchInfo.uri_prefix).then(function () {
      changeBranch(bid);
    });
  }

  function extractCommitData(res) {
    var commie = {};
    if (res['CommitID'] && res['CommitID']['@value']) commie.id = res['CommitID']["@value"];
    if (res['Time'] && res['Time']["@value"]) commie.time = (0, _parseFloat2["default"])(res['Time']["@value"]);
    if (res['Author'] && res['Author']["@value"]) commie.author = res['Author']["@value"];
    if (res['Message'] && res['Message']["@value"]) commie.message = res['Message']["@value"];
    if (res['Parent'] && res['Parent']["@value"]) commie.parent = res['Parent']["@value"];
    if (res['Child'] && res['Child']["@value"]) commie.child = res['Child']["@value"];
    return commie;
  }

  function changeBranch(bid) {
    setBranch(bid);
    dbClient.ref(false);
    dbClient.checkout(bid);
    if (props.onHeadChange) props.onHeadChange();
  }

  var cct = currentCommit ? currentCommit.time : nowts;
  return /*#__PURE__*/_react["default"].createElement(_reactstrap.Container, null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl mb-12"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 8,
    className: "mb-8"
  }, /*#__PURE__*/_react["default"].createElement(_DateTimeSlider.DateTimeSlider, {
    start: branchInfo.first,
    onChange: userChangesTime,
    end: end,
    current: current,
    updated: cct
  })), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 1,
    className: "mb-1"
  }), /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 3,
    className: "mb-3"
  }, /*#__PURE__*/_react["default"].createElement(_BranchSelector["default"], {
    branch: branchInfo,
    branches: branches,
    onChange: changeBranch
  }))), /*#__PURE__*/_react["default"].createElement("span", {
    className: "d-fl mb-12"
  }, /*#__PURE__*/_react["default"].createElement(_reactstrap.Col, {
    md: 12,
    className: "mb-12"
  }, /*#__PURE__*/_react["default"].createElement(_CommitView["default"], {
    commit: currentCommit,
    branch: branchInfo,
    setRef: userChangesCommit,
    onBranch: userCreatesBranch
  }))));
};

exports.HistoryNavigator = HistoryNavigator;