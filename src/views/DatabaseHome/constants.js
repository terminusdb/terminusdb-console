export const FAILED_LOADING_LATEST_UPDATES = {
    id: "FAILED_LOADING_LATEST_UPDATES",
    color: "danger",
    title: "Failed to load latest updates",
    message: "An error occurred while loading latest updates"    
}


export const EXAMPLE_FORM = {
    message: "An error occurred while loading latest updates"
}

export const MANAGE_COMPONENTS = {
    pull: {
        description: 'You can Pull latest changes on database from a branch',
        label: "Pull Branch",
    },
    push: {
        description: 'You can push your latest changed to a branch',
        label: "Push Branch",
    },
    fork: {
        description: 'You can fork this branch and continue working on the forked version',
        label: "Fork",
    }
}

export const TERMINUS_HOME_TITLE = "TerminusDB - Terminus Database"
export const TERMINUS_HOME_ADVICE = "This is the TerminusDB Terminus Database. It stores the internal meta-data about users, roles, databases, etc. It should not be updated directly - treat with care."

export const TERMINUS_BRANCH_BLURB = "Creating a new branch allows you to have multiple different live versions of the database at the same time which can be merged back together when desired"
export const TERMINUS_BRANCH_TITLE = "Create a new Branch"
export const BRANCH_BUTTON = "Branch"

export const CREATE_BRANCH_FORM =     {
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




export const TERMINUS_MERGE_BLURB = "Merging branches together creates a unified copy of the database from different branches which may have converged."
export const TERMINUS_MERGE_TITLE = "Merge Branches"

export const MERGE_BUTTON = "Merge"
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

export const TERMINUS_FORK_BLURB = "A fork allows you to ingest an existing database to become a branch of your current database."
export const TERMINUS_FORK_TITLE = "Create a Fork"
export const FORK_BUTTON = "Fork"


export const GRAPHS_BUTTON = "Graphs"
export const TERMINUS_GRAPHS_BLURB = "TerminusDB databases are divided internally into one or more named graphs. This gives you greater control over data-integration but comes at the cost of complexity." 
export const TERMINUS_GRAPHS_TITLE = "Graph Management"

export const PREFIXES_BUTTON = "URI Prefixes"
export const TERMINUS_PREFIXES_BLURB = "TerminusDB stores all data as RDF which uses URLs (IRIs more accurately) to give data global addressability and namespace protection. You can choose what URLs the data in your database will use." 
export const TERMINUS_PREFIXES_TITLE = "URI Prefix Management"

export const TERMINUS_DELETE_BLURB = "This will permanently remove this database and all its contents from the system - be careful not to delete any data that might be important in the future!" 
export const TERMINUS_DELETE_TITLE = "Delete your database"
export const DELETE_BUTTON = "DELETE"

export const collaborateSoonIntro = "collaborate-soon-icon"
export const collaborateSoonTop = "collaborate-soon-top"
export const collaborateSoonBottom = "collaborate-soon-bottom"
export const collaborateSoonBox = "collaborate-soon-box"
export const collaborateSoonButton = "collaborate-soon-button"