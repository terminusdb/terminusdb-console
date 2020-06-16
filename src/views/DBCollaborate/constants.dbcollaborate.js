export const COLLABORATE_SOON = {
    intro: "collaborate-soon-icon",
    top: "collaborate-soon-top",
    bottom: "collaborate-soon-bottom",
    box: "collaborate-soon-box",
    button: "collaborate-soon-button"
}

export const COLLABORATE_SECTIONS = [
    { 
        id: "users",
        title: "Manage Collaborators",
        icon: "user-friends",
        button: "Collaborators",
        blurb: "Add collaborators to your databases and manage the access rights of existing collaborators"
    },
    { 
        id: "pull",
        title: "Synchronise Updates",
        icon: "download",
        button: "Pull & Push",
        blurb: "Your database is connected to a remote origin repository - this allows you to synchronise between them by pushing and pulling updates",
    },
    { 
        id: "share",
        title: "Share",
        icon: "share-alt",
        button: "Share",
        blurb: "Securely Share your database with your collaborators all over the world through TerminusDB Hub"
    }
]

export const SYNCHRONISE_FORM = {
    fields: [
        {
            id: "remote",
            value: "",
            inputElement: {
                disabled: true,
                type: "input",              
            },
            label: 'Remote Repository Name'
        },
        {
            id: "remote_url",
            value: "",
            inputElement: {
                disabled: true,
                type: "input",              
            },
            label: 'Origin URL'
        },
        {
            id: "operation",
            value: "",
            inputElement: {
                placeholder: "choose operation",
                type: "select",
                options: [{value: "pull", label: "Pull Changes from Remote"}, {value: 'push', label: "Push Changes to Remote"}]              
            },
            label: 'Synchronise Operation'
        }        
    ],
    pushSuccessMessage: "Successfully pushed updates ",
    pushFailureMessage: "Failed to push updates ",
    pullSuccessMessage: "Successfully pulled updates ",
    pullFailureMessage: "Failed to pull updates ",
}


export const PULL_REMOTE_FORM = {
    fields: [
        {
            id: "remote_branch",
            value: "",
            inputElement: {
                placeholder: "defaults to master",
                type: "input",              
            },
            label: 'Pull from Remote Branch'
        },
        {
            id: "local_branch",
            value: "",
            inputElement: {
                placeholder: "select local branch",
                type: "select",
                options: []              
            },
            label: 'Pull to Local Branch'
        },
        {
            id: "user",
            value: "",
            label: 'Remote User Name',
            inputElement: {
                type: "input",
                placeholder: "enter username for remote server",
            }
        },
        {
            id: "password",
            value: "",
            label: 'Password',
            inputElement: {
                type: "input",
                placeholder: "enter password for remote server",
            }
        }, 
        {
            id: "commit",
            label: "Commit Message",
            inputElement: {
                type: "textarea",
                placeholder: "A short description of the reason for synchronising",
            }
        }               
    ],
    buttons: {
        submitText: "Pull Updates",
    }
}


export const PULL_LOCAL_FORM = {
    fields: [
        {
            id: "remote_branch",
            value: "",
            inputElement: {
                placeholder: "defaults to master",
                type: "input",              
            },
            label: 'Pull from Origin Branch'
        },
        {
            id: "local_branch",
            value: "",
            inputElement: {
                placeholder: "select local branch",
                type: "select",
                options: []              
            },
            label: 'Pull to Local Branch'
        }, 
        {
            id: "commit",
            label: "Commit Message",
            inputElement: {
                type: "textarea",
                placeholder: "A short description of the reason for synchronising",
            }
        }                 
    ],
    buttons: {
        submitText: "Pull Updates"
    }
}

export const PUSH_REMOTE_FORM = {
    fields: [
        {
            id: "local_branch",
            value: "",
            inputElement: {
                placeholder: "select local branch",
                type: "select",
                options: []              
            },
            label: 'Push From Local Branch'
        },
        {
            id: "remote_branch",
            value: "",
            inputElement: {
                placeholder: "defaults to master",
                type: "input",              
            },
            label: 'Push to Remote Branch'
        },
        {
            id: "user",
            value: "",
            label: 'Remote User Name',
            inputElement: {
                type: "input",
                placeholder: "enter username for remote server",
            }
        },
        {
            id: "password",
            value: "",
            label: 'Password',
            inputElement: {
                type: "input",
                placeholder: "enter password for remote server",
            }
        },
        {
            id: "commit",
            label: "Commit Message",
            inputElement: {
                type: "textarea",
                placeholder: "A short description of the reason for synchronising",
            }
        }                 
    ],
    buttons: {
        submitText: "Push Updates"
    }
}


export const PUSH_LOCAL_FORM = {
    fields: [
        {
            id: "local_branch",
            value: "",
            inputElement: {
                placeholder: "select local branch",
                type: "select",
                options: []              
            },
            label: 'Push From Local Branch'
        }, 
        {
            id: "remote_branch",
            value: "",
            inputElement: {
                placeholder: "defaults to master",
                type: "input",              
            },
            label: 'Push to Origin Branch'
        },
        {
            id: "commit",
            label: "Commit Message",
            inputElement: {
                type: "textarea",
                placeholder: "A short description of the reason for synchronising",
            }
        } 
    ],
    buttons: {
        submitText: "Push Updates"
    }
}

export const DEFAULT_LOCAL_PUSH_COMMIT = "Pushed commit to local db with console"
export const DEFAULT_LOCAL_PULL_COMMIT = "Pulled commit from local db with console"
export const DEFAULT_REMOTE_PUSH_COMMIT = "Pushed commit to remote db with console"
export const DEFAULT_REMOTE_PULL_COMMIT = "Pulled commit from remote db with console"