#!/bin/bash
echo "\
registry=https://api.bintray.com/npm/terminusdb/npm-dev
_auth=$BINTRAY_TOKEN
always-auth=true
email=robin@datachemist.com" > $TRAVIS_BUILD_DIR/.npmrc
VERSION=$(cat package.json | jq '.version' | sed 's/"//g')
npm unpublish "@terminusdb/terminusdb-console@$VERSION" || true
npm publish
curl -T console/dist/terminusdb-console.min.js -u"rrooij:$BINTRAY_CURL_API_KEY" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-console/$VERSION/$VERSION/terminusdb-console.min.js?publish=1&override=1"
curl -T console/dist/terminusdb-console-main.css -u"rrooij:$BINTRAY_CURL_API_KEY" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-console/$VERSION/$VERSION/terminusdb-console-main.css?publish=1&override=1"
