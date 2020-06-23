#!/bin/bash
git clone https://github.com/terminusdb/terminusdb-quickstart.git
terminusdb-quickstart/terminusdb-container run
(npm run serve&); sleep 15; npx cypress run
