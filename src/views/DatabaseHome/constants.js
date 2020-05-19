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

export const TERMINUS_MERGE_BLURB = "Merging branches together creates a unified copy of the database from different branches which may have converged."
export const TERMINUS_MERGE_TITLE = "Merge Branches"

export const TERMINUS_FORK_BLURB = "A fork allows you to ingest an existing database to become a branch of your current database."
export const TERMINUS_FORK_TITLE = "Create a Fork"
