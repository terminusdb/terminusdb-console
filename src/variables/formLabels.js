import { WOQL_JS, WOQL_JSON, WOQL_PY } from '../labels/queryFormats'

const createLocallyImg = "https://assets.terminusdb.com/terminusdb-console/images/create-locally.png"
const createRemoteImg = "https://assets.terminusdb.com/terminusdb-console/images/create-remote.png"
const createImg = "https://assets.terminusdb.com/terminusdb-console/images/create-db.png"
const copyImg = "https://assets.terminusdb.com/terminusdb-console/images/copy-db.png"
const copyLocallyImg = "https://assets.terminusdb.com/terminusdb-console/images/copy-locally.png"
const copyRemoteImg = "https://assets.terminusdb.com/terminusdb-console/images/copy-remote.png"
const cloneImg = "https://assets.terminusdb.com/terminusdb-console/images/clone.png"
const forkImg = "https://assets.terminusdb.com/terminusdb-console/images/fork.png"

export const createDbCard = {
    create:{
        title: 'Create New Database',
        text: 'Create a brand-new, empty database',
        image: createImg
    },
    copy:{
        title: 'Copy Existing Database',
        text: 'Copy an existing database',
        image: copyImg
    }
}

export const createDbCardOptions = {
    local:{
        title: 'Create Local Database',
        text: 'The database will be created on this server and only locally accessible',
        image: createLocallyImg
    },
    remote:{
        title: 'Create on TerminusDB.com',
        text: 'Host your database on terminusdb.com and share with collaborators through our secure sharing hub',
        image: createRemoteImg
    }
}


export const copyDbCardTypes = {
    clone:{
        title: 'Clone',
        text: 'A cloned version is still connected to the original and can be merged with it',
        image: cloneImg
    },
    fork:{
        title: 'Fork',
        text: 'A forked database is a completely independent copy of the original with all its history',
        image: forkImg
    },
}

export const copyDbCardOptions = {
    local:{
        title: 'Copy from this Server',
        text: 'Rapidly copy any database from this terminusdb server',
        image: copyLocallyImg
    },
    remote:{
        title: 'Copy from Remote Server',
        text: 'You can copy a database from any terminusdb server - you may have to provide security credentials',
        image: copyRemoteImg
    }
}


export const createDatabaseForm = {
    id: {
        label: {
            htmlFor: "databaseID",
            text: 'Database Id',
            className: "form"
        },
        input: {
            placeholder: "No spaces or special characters allowed in IDs",
            name: "databaseID",
            className: "form"
        },
        error: {
            text: "Cannot be blank. No spaces or special characters allowed in IDs",
            className: "errors"
        }
    },
    databaseName: {
        label: {
            htmlFor: "databaseName",
            text: "Database Name",
            className: "form"
        },
        input: {
            placeholder: "New name for database",
            name: "databaseName",
            className: "form"
        },
        error: {
            text: "Cannot be blank.",
            className: "errors"
        }
    },
    databaseDescr: {
        label: {
            htmlFor: "description",
            text: "Description",
            className: "form"
        },
        input: {
            placeholder: "A short text describing the database and its purpose",
            name: "databaseDescr",
            className: "form"
        }
    },
    createLocally: {
        label: {
            htmlFor: "createLocally",
            text: "Create Database locally",
            className: "form"
        },
        input: {
            name: "createLocally",
            className: "radB"
        }
    },
    createTerminusDb: {
        label: {
            htmlFor: "createTerminusDb",
            text: "Create Database in terminusdb.com",
            className: "form"
        },
        input: {
            name: "createTerminusDb",
            className: "radB"
        }
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Create"
    }
}

export const cloneLocalDB = {
    cloneSelect:{
        label: {
            htmlFor: "cloneDbLabel",
            text: "Clone from a local database",
            className: "form"
        },
        select: {
            className: "reactSelect",
            name: "selectDb",
            placeholder: "Database URL"
        }
    },
    id: {
        label: {
            htmlFor: "databaseID",
            text: 'Database Id *',
            className: "form"
        },
        input: {
            placeholder: "New Id for Cloned database. No spaces or special characters allowed in IDs",
            name: "databaseID",
            className: "form"
        },
        error: {
            text: "Cannot be blank. No spaces or special characters allowed in IDs",
            className: "errors"
        }
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Clone"
    }
}

export const cloneRemoteDB = {
    cloneRemote:{
        label: {
            htmlFor: "cloneRemote",
            text: "Clone from remote database",
            className: "form"
        },
        input: {
            name: "cloneRemote",
            className: "form",
            placeholder: "Remote URL"
        },
        error: {
            text: "Database URL to clone from is required",
            className: "errors"
        }
    },
    APIKey:{
        label: {
            htmlFor: "APIKey",
            text: "API Key",
            className: "form"
        },
        input: {
            placeholder: "Secret Key to connect to remote server",
            name: "APIKey",
            className: "form"
        },
        error: {
            text: "API Key Cannot be blank.",
            className: "errors"
        }
    },
    id: {
        label: {
            htmlFor: "databaseID",
            text: 'Database Id',
            className: "form"
        },
        input: {
            placeholder: "New Id for Cloned database. No spaces or special characters allowed in IDs",
            name: "databaseID",
            className: "form"
        }
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Clone"
    }
}

export const database = {
    master:{
        name: "masterURL",
        className: "form",
        placeholder: "Master URL"
    },
    clone:{
        name: "cloneURL",
        className: "form",
        placeholder: "Clone URL"
    },
    size: {
        name: "size",
        className: "form",
        label: "Size"
    },
    createdBy: {
        name: "createdBy",
        className: "form",
        label: "Created"
    },
    lastModifiedBy: {
        name: "lastModifiedBy",
        className: "form",
        label: "Last Modified"
    }
}

export const collaborate = {
    accessHeader:{
        name: "accessHeader",
        className: "form",
        label: "Your permissions"
    },
    readAccess:{
        name: "readAccess",
        className: "form",
        label: "Read"
    },
    writeAccess:{
        name: "writeAccess",
        className: "form",
        label: "Write"
    }
}


export const createUser = {
    id: {
        label: {
            htmlFor: "userID",
            text: 'User Id',
            className: "form"
        },
        input: {
            placeholder: "No spaces or special characters allowed in IDs",
            name: "userID",
            className: "form"
        },
        error: {
            text: "Cannot be blank. No spaces or special characters allowed in IDs",
            className: "errors"
        }
    },
    userName: {
        label: {
            htmlFor: "userName",
            text: "User Name",
            className: "form"
        },
        input: {
            placeholder: "User Name",
            name: "userName",
            className: "form"
        },
        error: {
            text: "Cannot be blank.",
            className: "errors"
        }
    },
    userEmail: {
        label: {
            htmlFor: "userEmail",
            text: "Email",
            className: "form"
        },
        input: {
            placeholder: "Email address",
            name: "userEmail",
            className: "form"
        }
    },
    userDescription: {
        label: {
            htmlFor: "userDescription",
            text: "Description",
            className: "form"
        },
        input: {
            placeholder: "Descibe user",
            name: "userDescription",
            className: "form"
        }
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Create"
    }
}

export const userList = {
    label: {
        htmlFor: "userList",
        text: 'Users with access to current db. Click on row to edit permissions',
        className: "form"
    },
    edit: {
        htmlFor: "editPermissions",
        text: 'Update permissions for user - ',
        className: "form"
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Update"
    }
}

export const addUser = {
    label: {
        htmlFor: "addUser",
        text: 'Users ',
        className: "form"
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Add User"
    }
}

export const commit = {
    act: {
        label: {
            htmlFor: "commit",
            text: 'Commit',
            className: "form"
        },
        input: {
            placeholder: "Commit message",
            name: "commit",
            className: "form"
        },
        error: {
            text: "Cannot be blank.",
            className: "errors"
        }
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Commit"
    }
}

export const editSchema = {
    edit: {
        type: "submit",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Edit"
    },
    cancel: {
        type: "cancel",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Cancel"
    },
    update: {
        type: "update",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Update"
    }
}

export const queryControls = {
    runQuery: {
        type: "submit",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Run Query"
    },
    woql: {
        type: "submit",
        className: "btn-q-fmt",
        text: WOQL_JS
    },
    jsonld: {
        type: "submit",
        className: "btn-q-fmt",
        text: WOQL_JSON
    },
    jsonpy: {
        type: "submit",
        className: "btn-q-fmt",
        text: WOQL_PY
    },
    newQuery:{
        type: "submit",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "New Query"
    },
    updateView:{
        type: "submit",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Update View"
    }
}

export const pull = {
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Pull"
    }
}

export const push = {
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Push"
    }
}

export const fork = {
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Fork"
    }
}

export const CommitViewerText = {
    next: {
        type: "submit",
        text: "Next Commit",
        className: "btn btn-primary lead mt-4",
    },
    previous: {
        type: "submit",
        text: "Previous Commit",
        className: "btn btn-primary lead mt-4",
    },
    time: {
        text: "Commit Time"
    },
    id: {
        text: "Commit ID"
    },
    author: {
        text: "Author"
    },
    message: {
        text: "Message"
    },
    branchButton: {
        type: "submit",
        text: "Create New Branch",
        className: "btn btn-primary lead mt-4",
    },
    branchInput: {
        type: "submit",
        text: "Branch ID",
        className: "form"
    }
}


export const commitBox = {
    label: {
        text: "As this query contains an update, you must provide a commit"
                + " message, to explain the reason for the change",
        className: "form"
    },
    input: {
        placeholder: "Enter reason for update here",
        name: "commitMessage",
        className: "form"
    },
    confirm: {
        type: "submit",
        text: "Confirm"
    },
    cancel: {
        type: "cancel",
        text: "Cancel"
    }
}
