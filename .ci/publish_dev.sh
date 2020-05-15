#!/bin/bash
echo "\
registry=https://api.bintray.com/npm/terminusdb/npm-dev
_auth=$BINTRAY_TOKEN
always-auth=true
email=robin@datachemist.com" > $TRAVIS_BUILD_DIR/.npmrc
VERSION=$(cat package.json | jq '.version' | sed 's/"//g')
npm unpublish "@terminusdb/terminusdb-console@$VERSION" || true
npm publish

for FILE in $(find console/dist -type f)
do
    UPLOAD_FILENAME=$(echo $FILE | sed 's,console/dist/,,')
    curl -T "$FILE" -u"rrooij:$BINTRAY_CURL_API_KEY" "https://api.bintray.com/content/terminusdb/terminusdb/terminusdb-console/$VERSION/$VERSION/$UPLOAD_FILENAME?publish=1&override=1"
done
