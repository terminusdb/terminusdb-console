export const MANAGE_SECTIONS = [
   /* { 
        id: "metadata",
        title: "Update Database Metadata",
        icon: "stamp",
        button: "Metadata",
        blurb: "Change the name of the database, its description and other metadata"
    },*/
    { 
        id: "branch",
        title: "Create a new Branch",
        icon: "code-branch",
        button: "Branch",
        blurb: "Creating a new branch allows you to have multiple different live versions of the database at the same time which can be merged back together when desired",
    },
    { 
        id: "merge",
        title: "Merge Branches",
        icon: "infinity",
        button: "Merge",
        blurb: "Merging branches together creates a unified copy of the database from different branches which may have converged."
    },
    { 
        id: "backup",
        title: "Backup and Restore",
        icon: "hdd",
        button: "Backup",
        blurb: "Backup your data either to disk or to the cloud, or restore it from backups"
    },
    { 
        id: "delete",
        title: "Delete Database",
        icon: "trash-alt",
        button: "DELETE",
        blurb: "This will permanently remove this database and all its contents from the system - be careful not to delete any data that might be important in the future!"
    }
]

export const DELETE_DB_MODAL = {
    prompt: "Enter the ID of the database you wish to delete",
    confirm: "Confirm Database Delete",
    error:  "The Database ID entered was incorrect",
    deleted: "Database Deleted",
    failed: "Failed to Delete Database"
}

export const CREATE_BRANCH_FORM = {
    fields: [
        {
            id: "bid",
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter ID of new branch",
            },
            label: 'New Branch ID',
            help: "A short and memorable identifier for the branch (e.g. dev, test...)",

        },
        {
            id: "commit",
            label: "Commit Message",
            inputElement: {
                type: "textarea",
                placeholder: "A short description of the reason for creating the new branch",
            }
        }
    ],
    buttons: {
        submitText: "Create New Branch"
    }
}

export const BRANCH_SOURCE_FORM = {
    fields: [
        {
            id: "branch",
            inputElement: {
                disabled: true,
                type: "input",
            },
            label: 'Branch',
        },
        {
            id: "ref",
            inputElement: {
                disabled: true,
                type: "input",
            },
            label: 'Commit ID',
            helpCols: 8,
            help: "The position in the branch that the new branch will sprout from",

        },
        {
            id: "time",
            inputElement: {
                disabled: true,
                type: "input",
            },
            label: 'Time',
            help: "The time at which the new branch will start",
        },
    ],
    infoMessage: "Start Branch From : the new branch will be started from your current database state - you can change this with the time traveller or branch selector component in the top navigation bar"
}
 

export const MERGE_BRANCH_FORM = {
    fields: [
        {
            id: "source",
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "ID of commit to branch from",
            },
            label: 'Source Commit',
            help: "You can choose to merge differences from any commit in the database - any branch at any time",
        },
        {
            id: "target",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Enter ID of new branch",
                options: []
            },
            label: 'Target Branch',
            help: "The target of a merge must be the head of a branch",
        },
        {
            id: "commit",
            label: "Commit Message",
            inputElement: {
                type: "textarea",
                placeholder: "A short description of the reason for merging",
            }
        }
    ],
    actionText: "Merge Branches",
    buttons: {
        submitText: "Merge Branches"
    }
}


export const METADATA_FORM = {
    actionText: "Update Database Metadata",
    buttons: {
        submitText: "Update Metadata"
    }
}


export const BACKUP_FORM = {
    fields: [
        {
            id: "which",
            value: "backup",
            mandatory: true,
            inputElement: {
                type: "select",
                options: [{label: "Backup", value:"backup"}, {label: "Restore", value: "restore"}]
            },
            label: 'Backup or Restore'
        },
        {
            id: "target",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Choose Target",
                options: [{label: "Browser Download", value:"browser"}, {label: "Local Storage", value: "local"}, {label: "Online Storage", value:"online"}]
            },
            label: 'Target',
        },
        {
            id: "format",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Choose Format",
                options: [{label: "TerminusDB Compressed", value:"terminus"}, {label: "Turtle (RDF)", value: "ttl"}, {label: "CSV", value:"csv"}]
            },
            label: 'Format',
        },
        {
            id: "filename",
            value: "",
            inputElement: {
                type: "input",
                placeholder: "Choose Title of file",
            },
            label: 'Format',
        },
    ],
    actionText: "Backup Database",
    buttons: {
        submitText: "Backup Database"
    }
}



