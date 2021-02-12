BRANCH=$1
gsutil cp -r console/dist/* "gs://js_blobs/terminusdb_console/${BRANCH}/"
