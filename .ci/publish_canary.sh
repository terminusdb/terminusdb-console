#!/bin/bash
curl -T "console/dist/terminusdb-console-main.css" -u"rrooij:$BINTRAY_CURL_API_KEY" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-console/canary/canary/terminusdb-console-main.css?publish=1&override=1"
curl -T "console/dist/terminusdb-console.min.js" -u"rrooij:$BINTRAY_CURL_API_KEY" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-console/canary/canary/terminusdb-console.min.js?publish=1&override=1"
