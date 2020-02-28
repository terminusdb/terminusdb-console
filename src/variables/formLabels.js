export const createDatabaseForm = {
    id: {
        label: {
            htmlFor: "databaseID",
            text: 'Database Id *',
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
            text: "Database Name *",
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
