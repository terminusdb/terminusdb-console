# Create DB

Contains all the logic and forms for creation of new databases (including cloning)

Current divided into 4 main components

1. CreateLocalForm -> logic for creation of a new local db - uses local createDatabase API call (should be only place this happens!!!)
1. CreateRemoteForm -> logic for creation of a new db on terminusdb.com
1. CopyLocalForm -> logic for creation of a clone (or other type of copy) of a local db
1. CopyRemoteForm -> logic for cloning remote dbs

Rest of content is: 

* Creation Journey / choices: 
** BreadCrumbs, 
** DatabaseCard
** CreateOptions
** CreateOrCopy
