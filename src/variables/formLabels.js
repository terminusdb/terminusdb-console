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
        className: "ic-a-us",
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
