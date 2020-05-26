/**
 * The history navigator is a UI widget which allows a user to change their branch and time to view the database at
 * any specific time / branch
 */
import React, { useState, useEffect } from "react";
import { addHours, startOfHour } from "date-fns";
import { Container, Col, Row } from "reactstrap";
import { BranchSelector } from './BranchSelector'
import { DateTimeSlider } from './DateTimeSlider'
import { CommitTraveller } from './CommitTraveller'
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLClientObj } from "../../init/woql-client-instance";
import {HISTORY} from "./constants.history"

export const HistoryNavigator = (props) => {
	/*to be review*/

    const {woqlClient} = WOQLClientObj();
    const dbClient=(props.local ? woqlClient.copy() : woqlClient);

    // no history for terminus (master) db
    if(dbClient.db() == "terminus") return null
    let nowts = props.now || parseFloat(startOfHour(addHours(new Date(), 1)).getTime()/1000)
    const [branches, setBranches] = useState(props.branches);
    const [ref, setRef] = useState(props.ref);
    const [settingCommit, setSettingCommit] = useState(false);
    const [end, setEnd] = useState(nowts);
    const [current, setCurrent] = useState(nowts);
    const [currentCommit, setCommit] = useState();
    const [branch, setBranch] = useState(props.branch || dbClient.checkout());
    const [branchInfo, setBranchInfo] = useState();

    //retrieves details of the available branches
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(dbClient)
        dbClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let bchoices = []
            var res
            while(res = wr.next()){
               bchoices.push({value: res['BranchName']["@value"], label: res['BranchName']["@value"]})
            }
            setBranches(bchoices)
        })
    }, []);

    //retrieves details of the branch, only when the branch is changed
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchLimits(dbClient)
        dbClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let res = wr.first()
            setBranchInfo({
                id: dbClient.checkout(),
                last: res['Last']['@value'],
                first: res['First']['@value'] || res['Last']['@value'],
                head: res['HeadID']["@value"],
                count: ((res['Path'] && Array.isArray(res['Path'])) ? res['Path'].length : 1),
            })
            setRef(res['HeadID']["@value"])
            if(props.setCreated) props.setCreated(res['First']['@value'] || res['Last']['@value'])
        })
    }, [branch]);

    //retrieves details of the commit with id ref
    useEffect(() => {
        if(ref){
            const q2 = TerminusClient.WOQL.lib().loadCommitDetails(dbClient, ref)
            dbClient.query(q2).then((cresults) => {
                let cwr = new TerminusClient.WOQLResult(cresults, q2)
                let cres = cwr.first()
                let commie = extractCommitData(cres)
                commie.id = ref
                if(settingCommit){
                    setCurrent(commie.time)
                    setSettingCommit(false)
                    if(props.onHeadChange) props.onHeadChange(branch, ref)
                }
                if(props.setCommitInfo) props.setCommitInfo(commie)
                setCommit(commie)
            })
        }
    }, [ref]);

    //retrieves details of the previous commit, only when user changes time
    function userChangesTime(ts){
        if(ts && (Math.floor(current) != Math.floor(ts))){
            setCurrent(ts)
            const fts = String(ts)
            const q3 = TerminusClient.WOQL.lib().loadCommitBefore(dbClient, fts)
            dbClient.query(q3).then((lresults) => {
                let lwr = new TerminusClient.WOQLResult(lresults, q3)
                let lres = lwr.first()
                if(lres){
                    let commie = extractCommitData(lres)
                    if(commie.child){
                        dbClient.ref(commie.id)
                    }
                    else dbClient.ref(false)
                    if(!currentCommit || commie.id != currentCommit.id){
                         setCommit(commie)
                         if(props.onHeadChange) props.onHeadChange(branch, commie.id)
                         if(props.setCommitInfo) props.setCommitInfo(commie)
                    }
                }
            })
        }
    }

    //change the commit and change the time on the timeline to the commit time
    function userChangesCommit(cid){
        setSettingCommit(true);
        setRef(cid)
        if(props.onHeadChange) props.onHeadChange(branch, cid)
    }

    function extractCommitData(res){
        let commie = {}
        if(res['CommitID'] && res['CommitID']['@value']) commie.id = res['CommitID']["@value"]
        if(res['Time'] && res['Time']["@value"]) commie.time = parseFloat(res['Time']["@value"])
        if(res['Author'] && res['Author']["@value"]) commie.author = res['Author']["@value"]
        if(res['Message'] && res['Message']["@value"]) commie.message = res['Message']["@value"]
        if(res['Parent'] && res['Parent']["@value"])commie.parent = res['Parent']["@value"]
        if(res['Child'] && res['Child']["@value"])commie.child = res['Child']["@value"]
        return commie
    }

    function changeBranch(bid){
        setBranch(bid)
        dbClient.ref(false)
        dbClient.checkout(bid)
        if(props.onHeadChange) props.onHeadChange(bid, false)
    }

    let cct = (currentCommit ? currentCommit.time : nowts)
    const showBranches = (branches && branchInfo && (branches.length > 0)) 
    return (
        <Container className={HISTORY.containerClassName}>
            <Row>
                {(branches && branchInfo) && 
                    <Col md={6} className={HISTORY.sliderColClassName}>
                        <DateTimeSlider start={branchInfo.first}
                            onChange={userChangesTime}
                            end={end}
                            current={current}
                            updated={cct} />
                    </Col>
                }
                {(branches && branchInfo) && 
                    <Col md={4} className={HISTORY.commitColClassName}>
                        {currentCommit && <CommitTraveller setRef={userChangesCommit} commit={currentCommit}/>}
                    </Col>
                }
                {showBranches && 
                    <Col md={2} className={HISTORY.branchColClassName}>
                        <BranchSelector branch={branchInfo} branches={branches} onChange={changeBranch}/>
                    </Col>
                }
            </Row>
        </Container>
    )
}
