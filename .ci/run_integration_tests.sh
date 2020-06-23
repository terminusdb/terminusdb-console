#!/bin/bash
git clone https://github.com/terminusdb/terminusdb-quickstart.git
terminusdb-quickstart/terminusdb-container run
(npm run start&); sleep 15; npx cypress run
