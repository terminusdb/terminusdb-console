"use strict";

var fs = require("fs");

var path = require("path");

function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];

  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);

    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);

      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile);
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    }
  }

  ;
  walkDir(dir);
  return filesToReturn;
}

module.exports = getFilesFromDir;