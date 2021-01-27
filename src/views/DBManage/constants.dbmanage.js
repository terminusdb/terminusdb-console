export const MANAGE_SECTIONS = [
    {
        id: "branch",
        title: "Create a new Branch",
        icon: "code-branch",
        button: "Branch",
        blurb: "New branches can be started from any commit in the database. They are created with the state of the database exactly as it was when that commit was completed.",
    },
    {
        id: "merge",
        title: "Merge Branches",
        icon: "infinity",
        button: "Merge",
        blurb: "Merging branches together creates a unified copy of the database from different branches which may have converged."
    }
]

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
    },
    branchSuccessMessage: "Successfully Created New Branch ",
    branchFailureMessage: "Failed to Create New Branch ",
}

export const BRANCH_SOURCE_FORM = {
    fields: [
        {
            id: "branch",
            inputElement: {
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
            help: "New branches can start from any historical commit in the database",

        },
        {
            id: "time",
            inputElement: {
                disabled: true,
                type: "input",
            },
            label: 'Time'
        },
    ],
    infoMessage: "Start Branch From : the new branch will be started from your current database state - you can change this with the time traveller or branch selector component in the top navigation bar"
}


export const MERGE_BRANCH_FORM = {
    mergeSuccessMessage: "Successfully merged ",
    mergeFailureMessage: "Failed to merge",
    fields: [
        {
            id: "target",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Choose branch to merge into",
                options: []
            },
            label: 'Merge into branch',
            help: "You can merge into the head of any branch",
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

export const MERGE_SOURCE_FORM = {
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
            help: "Merges can start from any historical commit",

        },
        {
            id: "time",
            inputElement: {
                disabled: true,
                type: "input",
            },
            label: 'Time'
        },
    ],
    infoMessage: "Merge From: the merge will start from your current state - you can change this with the time traveller or branch selector component in the top navigation bar"
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

export const SQUASH_BRANCH_FORM = {
    commit: {
        id: "commit",
        label: "Commit Message",
        inputElement: {
            type: "textarea",
            placeholder: "A short description of the reason to squash the branch",
            className: "branch-commit-textarea"
        }
    },
    buttons: {
        submitText: "Squash Branch"
    },
    squashBranchSuccessMessage: "Successfully squashed Branch ",
    squashBranchFailureMessage: "Failed to squash Branch ",
}

export const RESET_BRANCH_FORM = {
    commitDescriptor: {
        id: "commitDescriptor",
        label: "Commit Descriptor",
        inputElement: {
            type: "textarea",
            placeholder: "Commit Descriptor to reset branch to ",
            className: "branch-commit-textarea"
        }
    },
    buttons: {
        submitText: "Reset Branch"
    },
    resetBranchSuccessMessage: "Successfully reset Branch ",
    resetBranchFailureMessage: "Failed to reset Branch ",
}

export const OPTIMIZE_BRANCH_FORM = {
    description: "Optimize resources in database ",
    buttons: {
        submitText: "Optimize Branch"
    },
    optimizeSuccessMessage: "Successfully optimized database ",
    optimizeFailureMessage: "Failed to optimize database ",
}

export const NEW_BRANCH="New Branch"
export const MERGE_BRANCH="Merge Branch"
export const CLOSE_BRANCH="Close Branch"
export const DELETE_BRANCH="Delete Branch"
export const RESET_BRANCH="Reset Branch"
export const OPTIMIZE_BRANCH="Optimize Branch"
export const SQUASH_BRANCH="Squash Branch"
