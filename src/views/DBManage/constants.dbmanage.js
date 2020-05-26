export const MANAGE_SECTIONS = [
    { 
        id: "metadata",
        title: "Update Database Metadata",
        icon: "",
        button: "Metadata",
        blurb: "Change the name of the database, its description and other metadata"
    },
    { 
        id: "branch",
        title: "Create a new Branch",
        icon: "",
        button: "Branch",
        blurb: "Creating a new branch allows you to have multiple different live versions of the database at the same time which can be merged back together when desired",
    },
    { 
        id: "merge",
        title: "Merge Branches",
        icon: "",
        button: "Merge",
        blurb: "Merging branches together creates a unified copy of the database from different branches which may have converged."
    },
    { 
        id: "backup",
        title: "Backup and Restore",
        icon: "",
        button: "Backup",
        blurb: "Backup your data either to disk or to the cloud, or restore it from backups"
    },
    { 
        id: "delete",
        title: "Delete Database",
        icon: "",
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


export const DELETE_BUTTON = "DELETE"

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
            id: "source",
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "ID of commit to branch from",
            },
            label: 'Source Commit',
            help: "You can choose to start a new branch from anywhere in the history of any branch. All commits are uniquely identified",
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
        cancelText: "Cancel",
        submitText: "Create New Branch"
    }
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
    buttons: {
        cancelText: "Cancel",
        submitText: "Merge Branches"
    }
}


export const CREATE_GRAPH_FORM = {
    graphDeletedLocation: "(Console, Graph Delete)",
    graphCreatedLocation: "(Console, Graph Create)",
    createSuccess: "Graph Successfully Created",
    createFailure: "Failed to Create Graph",
    fields: [
        {
            id: "gtype",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                options: [{value: "schema", label: "Schema Graph"}, {value: "instance", label: "Instance Graph"}, {value: "inference", label: "Inference Graph"}],
                placeholder: "Select Graph Type"
            },
            label: 'Graph Type',
            help: "Instance graphs contain data, schema graphs contain rules, inference graphs contain inference rules",
        },
        {
            id: "gid",
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter ID of new graph",
            },
            label: 'Graph ID',
            help: "A short simple string to identify the graph - no spaces or special characters allowed",
        },
        {
            id: "commit",
            label: "Commit Message",
            inputElement: {
                type: "textarea",
                placeholder: "A short description of the reason for your changes",
            }
        }
    ],
    buttons: {
        cancelText: "Cancel",
        submitText: "Create New Graph"
    }
}



export const MERGE_BUTTON = "Merge"
export const PREFIXES_BUTTON = "URI Prefixes"
export const GRAPHS_BUTTON = "Graphs"
export const BRANCH_BUTTON = "Branch"
export const FORK_BUTTON = "Fork"
