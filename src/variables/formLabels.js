import { WOQL_JS, WOQL_JSON, WOQL_PY } from '../labels/queryFormats'
import createLocallyImg from "../img/icons/create-locally.png"
import createRemoteImg from "../img/icons/create-remote.png"
import createImg from "../img/icons/create-db.png"
import copyImg from "../img/icons/copy-db.png"
import copyLocallyImg from "../img/icons/copy-locally.png"
import copyRemoteImg from "../img/icons/copy-remote.png"
import cloneImg from "../img/icons/clone.png"
import forkImg from "../img/icons/fork.png"

export const createGraphText = {
    cancelButtonClassName: "btn btn-primary lead mt-4",
    createButtonClassName: "btn btn-primary lead mt-4",
    errorClassName: "errors",
    helpClassName: "create-form-helptext",
    requiredField: "is a required field",
    cancelButtonText: "Cancel",
    selectClassName: "brSeltr",
    inputClassName: "form",
    createButtonText: "Create Graph",
    fields: {
        gtype: {
            label: 'Graph Type',
            help: "Instance graphs contain data, schema graphs contain rules, inference graphs contain inference rules",
            placeholder: "Select Graph Type"
        },
        gid: {
            label: 'Graph ID',
            placeholder: ""
        }
    }

}

export const createDBText = {
    labelClassName: "form",
    inputClassName: "form",
    errorClassName: "errors",
    helpClassName: "create-form-helptext",
    requiredField: "is a required field",
    createButtonClassName: "btn btn-primary lead mt-4",
    advancedWrapperClassName: "advanced-settings-create-form",
    advancedButtonClassName: "btn-minor lead mt-4 btn",
    advancedSectionClassName: "advanced-section-create-form",
    graphsRowClassName: "graph-row-create-form",
    checkboxWrapperClassName: "checkbox-wrapper-create-form",
    checkboxLabelClassName: "checkbox-label-create-form",
    checkboxClassName: "checkbox-create-form",
    createButtonText: "Create New Database",
    hideAdvanced: "Hide Advanced Settings",
    showAdvanced: "Show Advanced Settings",
    schemaGraphCommitMessage: "Main Schema Graph Created by console during DB create",
    instanceGraphCommitMessage: "Main Instance Graph Created by console during DB create",
    instanceFailedSchemaWorkedMessage: " and schema graph main, but failed to create instance graph",
    schemaFailedMessage: " but failed to create main schema graph",
    instanceFailedSchemaWorkedMessage: " created main schema graph but failed to create main instance graph. You must create an instance graph before you can add data to this database",
    noDataGraphMessage: " Database has no instance graph.  You must create an instance graph before you can add data to this database",
    noSchemaGraphMessage: " Database is schema free. If you want to enable quality control and advanced WOQL features, you must add a schema to this database",
    instanceFailedMessage: "but failed to create main instance graph",
    noGraphMessage: " Empty Database - at least one graph must be created before anything can be stored in this database.",
    createSuccessMessage: "Successfully Created Database: ",
    sections: {
        details: {
            fields: {
                dbid: {
                    label: 'Database ID',
                    help: "The database ID forms part of the URL - spaces are not allowed, simple ids using only alphanumerics and underscores are encouraged",
                    placeholder: "Enter ID of new database"
                },
                dbname: {
                    label: 'Database Name',
                    help: "Choose A short but distinctive name that allows you to easily understand what's in the database",
                    placeholder: "Enter name new database"
                },
                description: {
                    label: 'Description',
                    placeholder: "Enter a short text describing the database, its scope and purpose",
                }
            }
        },
        advanced: {
            fields: {
                graphs: {
                    label: 'Create Graphs',
                    help: "By default, databases are created with a schema graph (for defining rules about stored data) and an instance graph (for storing the data itself). If you do not wish to create these graphs (for example if you want a schema-free database or a schema-only database for storing libraries), uncheck the boxes here. You can always create them later.",
                    schema_text: "Create Schema Graph (main)",
                    instance_text: "Create Instance Graph (main)"
                },
                data_url: {
                    label: 'Data Base URL (doc:)',
                    help: "All data in TerminusDB is addressable by URL - you can choose the default URL prefix that you want to use for your internal data. This can be useful, for example, if you want to create a linked data application where all data is dereferencable",
                },
                schema_url: {
                    label: 'Schema Base URL (scm:)',
                    help: "Every TerminusDB database has a local namespace scm: available for defining local schema elements. You can choose the URL that you want this prefix to derefence to - this allows you to make your schemata dereferencable at the URL of your choice.",
                }
            }
        }

    }
}

export const createDbCard = {
    create:{
        title: 'Create New Database',
        text: 'You can opt to create a brand new empty database.',
        image: createImg
    },
    copy:{
        title: 'Copy Existing Database',
        text: 'You can opt to copy an existing database from you local machiene or from a remote server',
        image: copyImg
    }
}

export const createDbCardOptions = {
    local:{
        title: 'Create Database locally',
        text: 'The database will be created on your local machine and can accessed only by you.',
        image: createLocallyImg
    },
    remote:{
        title: 'Create Database on terminusdb.com',
        text: 'The database will be created on terminusdb.com and you can share this with other hub users as well.',
        image: createRemoteImg
    }
}


export const copyDbCardTypes = {
    fork:{
        title: 'Fork',
        text: 'You can choose to fork your copy',
        image: forkImg
    },
    clone:{
        title: 'Clone',
        text: 'You can choose to clone your copy',
        image: cloneImg
    }
}

export const copyDbCardOptions = {
    local:{
        title: 'Copy database from local machine',
        text: 'You select any database in your local machine to copy',
        image: copyLocallyImg
    },
    remote:{
        title: 'Copy database from a remote server',
        text: 'You can choose to copy database from any server, You will have to provide key if database resides in other server other than terminusdb.com',
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
