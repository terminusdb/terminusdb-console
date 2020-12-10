#!/bin/bash
BRANCH=$1
curl -u "rrooij:$BINTRAY_API_TOKEN" "https://api.bintray.com/npm/terminusdb/npm-$BRANCH/auth" > .npmrc
curl -XDELETE "https://api.bintray.com/packages/terminusdb/npm-$BRANCH/terminusdb:terminusdb-console" -u "rrooij:$BINTRAY_API_TOKEN"
npm publish
curl -T "console/dist/terminusdb-console-main.css" -u"rrooij:$BINTRAY_API_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-console/$BRANCH/$BRANCH/terminusdb-console-main.css?publish=1&override=1"
curl -T "console/dist/terminusdb-console.min.js" -u"rrooij:$BINTRAY_API_TOKEN" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-console/$BRANCH/$BRANCH/terminusdb-console.min.js?publish=1&override=1"
