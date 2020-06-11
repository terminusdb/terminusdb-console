export const CREATE_BREADCRUMB = "Create"
export const COPY_BREADCRUMB = "Copy"
export const LOCAL_BREADCRUMB = "Local"
export const REMOTE_BREADCRUMB = "Remote"
export const CREATE_REMOTE = "New Database Details"
export const COPY_REMOTE = "Remote Copy Details"
export const CREATE_LOCAL = "New Database Details"
export const COPY_LOCAL = "Database Details"
export const LOCAL_OR_REMOTE = "Local or Remote"

export const OPTIONS_PANE_CSS = "col-md-12 justify-content-center" 
export const OPTIONS_PANE_COL_CSS = "col-md-5"
export const CARD_CONTAINER_CSS = "square db-view-cards"


export const DBCARD_IMG_CSS = "newdb-card-img"
export const DBCARD_CONTAINER_CSS = "contentSquare"
export const DBCARD_TITLE_CSS = "mb-4 db-view-card-title"
export const DBCARD_BODY_CSS = "db-view-card-text"

import { TERMINUS_IMAGE_BASE } from "../../constants/images"

const createLocallyImg = TERMINUS_IMAGE_BASE  + "create-locally.png"
const createRemoteImg = TERMINUS_IMAGE_BASE  + "create-remote.png"
const createImg = TERMINUS_IMAGE_BASE + "create-db.png"
const copyImg = TERMINUS_IMAGE_BASE + "copy-db.png"
const copyLocallyImg = TERMINUS_IMAGE_BASE + "copy-locally.png"
const copyRemoteImg = TERMINUS_IMAGE_BASE + "copy-remote.png"

//const cloneImg = TERMINUS_IMAGE_BASE + "clone.png"
//const forkImg = TERMINUS_IMAGE_BASE + "fork.png"


export const CREATE_OR_COPY_CARD = {
    create:{
        id : 'create_db',
        title: 'Create New Database',
        text: 'Create a brand-new, empty database',
        image: createImg
    },
    copy:{
        id : 'copy_db',
        title: 'Copy Existing Database',
        text: 'Copy an existing database',
        image: copyImg
    }
}

export const CREATE_CARD = {
    local:{
        id : 'create_db_local',
        title: 'Create Local Database',
        text: 'The database will be created on this server and only locally accessible',
        image: createLocallyImg
    },
    remote:{
        id : 'create_db_remote',
        title: 'Create on TerminusDB.com',
        text: 'Host your database on terminusdb.com and share with collaborators through our secure sharing hub',
        image: createRemoteImg
    }
}

export const COPY_CARD = {
    local:{
        id: 'copy_db_local',
        title: 'Copy from this Server',
        text: 'Rapidly copy any database from this terminusdb server',
        image: copyLocallyImg
    },
    remote:{
        id: 'copy_db_remote',
        title: 'Copy from Remote Server',
        text: 'You can copy a database from any terminusdb server - you may have to provide security credentials',
        image: copyRemoteImg
    }
}

export const CREATE_DB_FORM = {
    createButtonText: "Create New Database",
    schemaGraphCommitMessage: "Main Schema Graph Created by console during DB create",
    schemaFailedMessage: " but failed to create main schema graph",
    noSchemaGraphMessage: " Database is schema free. If you want to enable quality control and advanced WOQL features, you must add a schema to this database",
    createFailureMessage: "Failed to Create Database",
    createSuccessMessage: "Successfully Created Database: ",
    buttons: {
        submitText: "Create New Database"
    }
}

export const DB_DETAILS_FORM = {
    fields: [
        {   
            id: "dbid",
            maxLenght:200,
            value: "",
            helpCols: 9,
            label: 'Database ID',
            help: "The database ID forms part of the URL - spaces are not allowed",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter ID of new database"
            }
        },
        {   
            id: "dbname",
            label: 'Database Name',
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter name of new database"
            }
        },
        {
            id: "description",
            label: 'Description',
            value: "",
            inputElement: {
                type: "textarea",
                placeholder: "Enter a short text describing the database, its scope and purpose",
            },
        },
    ],
}

export const DB_ADVANCED_FORM = {
    advancedWrapperClassName: "advanced-settings-create-form",
    advancedButtonClassName: "advanced-button btn-minor lead mt-4 btn",
    advancedSectionClassName: "advanced-section-create-form",
    hideAdvanced: "Hide Advanced Settings",
    showAdvanced: "Show Advanced Settings",    
    fields: [
        {
            id: "schema",
            value: true,
            label: 'Create Schema Graph',
            helpCols: 9,
            help: "By default, databases are created with a schema graph for defining rules about stored data. If you want a schema-free database, uncheck the box here.",
            inputElement: {
                label: "Create schema graph main",
                type: "checkbox"
            },
        },
        {
            id: "data_url",
            label: 'Base URL for Data',
            value: "",
            helpCols: 9,
            inputElement: {
                type: "input",
                placeholder: "Leave Blank to use default URI",
            },
            help: "All data in TerminusDB is addressable by URL - you can choose the default URL prefix that you want to use for your internal data. This can be useful, for example, if you want to create a linked data application where all data is dereferencable",
        },
        {   
            id: "schema_url",
            label: 'Base URL for schema elements',
            value: "",
            helpCols: 9,
            inputElement: {
                type: "input",
                placeholder: "Leave Blank to use default URI"
            },
            help: "Every TerminusDB database has a local namespace scm: available for defining local schema elements. You can choose the URL that you want this prefix to derefence to - by convention schema URLs end in a '#' character.",
        }
    ]
}

export const COPY_LOCAL_FORM = {
    detailsWrapperClassName: "copy-db-details-form",
    detailsHeaderClassName: "copy-db-details-header",
    detailsHeader: "",
    cloneFailureMessage: "Failed to clone ",
    cloneSuccessMessage: "Successfully cloned ",
    actionText: "Copy Local Database",
    fields: [
        {
            id: "dbsource",
            value: "",
            cowDuck: false,
            mandatory: true,
            label: 'Copy From',
            inputElement: {
                type: "select",
                placeholder: "Choose Database to Copy",
            }
        },
        {
            id: "newid",
            value: "",
            cowDuck: false,
            mandatory: true,
            label: 'New ID',
            inputElement: {
                type: "input",
                placeholder: "Choose a new ID for the copy",
            }
        }
    ],
    buttons: {
        submitText: "Create Copy"
    }
}

export const COPY_REMOTE_FORM = {
    detailsWrapperClassName: "copy-db-details-form",
    detailsHeaderClassName: "copy-db-details-header",
    detailsHeader: "",
    cloneFailureMessage: "Failed to clone ",
    cloneSuccessMessage: "Successfully cloned ",
    actionText: "Copy Remote Database",
    sample: {
        dbid: "sales-marketing-01",
        dbname: "Marketing Statistics (imported)",
        description: "The sales and marketing latest analysis outputs and source data. This constitutes the most up to date and reliable data we have as it feeds from the main PoS system and updates are published hourly. Please be careful before pushing to master as it is live!"
    },
    fields: [
        {
            id: "dbsource",
            value: "",
            mandatory: true,
            label: 'Copy From',
            inputElement: {
                type: "input",
                placeholder: "Enter URL of TerminusDB Database",
            },
            help: "The URL of the database is normally of the form: https://my.host.com/db/<account_id>/<database_id>"
        },
        {
            id: "newid",
            value: "",
            label: 'New ID',
            inputElement: {
                type: "input",
                placeholder: "enter id of new db",
            }
        },
        {
            id: "name",
            value: "",
            mandatory: true,
            label: 'New DB Name',
            inputElement: {
                type: "input",
                placeholder: "Enter name of new db",
            }
        },
        {
            id: "user",
            value: "",
            label: 'User Name',
            inputElement: {
                type: "input",
                placeholder: "enter username",
            }
        },
        {
            id: "password",
            value: "",
            label: 'Password',
            inputElement: {
                type: "input",
                placeholder: "enter password",
            }
        }
    ],
    buttons: {
        submitText: "Copy Remote Database"
    }
}



export const COPY_DB_DETAILS_FORM = {
    fields: [
        {   
            id: "dbid",
            label: 'Database ID',
            inputElement: {
                type: "input",
                disabled: true,
            }
        },
        {   
            id: "dbname",
            label: 'Database Name',
            inputElement: {
                type: "input",
                disabled: true,
            }
        },
        {
            id: "description",
            label: 'Description',
            inputElement: {
                type: "textarea",
                disabled: true
            }
        }
    ]
}


export const CREATE_REMOTE_FORM = {
    createButtonText: "Create New Database",
    actionText: "Creating Databases on TerminusDB.com",
    createFailureMessage: "Failed to Create Database",
    createSuccessMessage: "Successfully Created Database: ",
    fields: [
        {   
            id: "dbid",
            label: 'Database ID',
            inputElement: {
                type: "input",
                placeholder: "Enter New DB ID"
            },
            help: "Help on how to choose a good id"
        },
        {   
            id: "dbname",
            label: 'Database Name',
            inputElement: {
                type: "input",
                placeholder: "Choose your database's name"
            }
        },
        {
            id: "topic",
            label: 'Topic',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "Finance"}, {value: "z", label: "Science"}],
                placeholder: "Select a topic"
            },
        },
        {
            id: "region",
            label: 'Region',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "Europe"}, {value: "z", label: "North America"}],
                placeholder: "Select region"
            },
        },
        {
            id: "audience",
            label: 'Audience',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "All Collaborators"}, {value: "z", label: "Team A"}],
                placeholder: "Choose Audience"
            },
        },
        {
            id: "description",
            label: 'Description',
            inputElement: {
                type: "textarea",
                placeholder: "Enter a description of the purpose of the database"
            },
            help: "Help on what goes here"

        },
        {
            id: "privacy",
            label: 'Privacy',
            inputElement: {
                type: "select",
                placeholder: "Public or Private",
                options: [{value: "public", label: "Public"}, {value: "private", label: "Private"}]
            }
        },
        {
            id: "license",
            label: 'License',
            inputElement: {
                type: "select",
                options: [{value: "x", label: "Creative Commons"}, {value: "z", label: "Open Source"}],
                placeholder: "Choose License"
            }
        },
        {
            id: "legalese",
            label: 'Agreement',
            inputElement: {
                type: "textarea",
                disabled: true,                
            }
        },
        {
            id: "disclaimer",
            label: 'Terms and conditions',
            inputElement: {
                type: "checkbox",
                label: "I confirm I agree to the above conditions"
            }
        }
    ],
    sample: {
        legalese: "I agree to abide by the terms and conditions of the TerminusDB user agreement, and furthermore attest that I possess the legal right to share this data publicly",
    },
    buttons: {
        submitText: "Create Database"
    }
}
