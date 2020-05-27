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
        title: "Pull Updates",
        icon: "download",
        button: "Pull",
        blurb: "If your database is tracking one or more remote servers, you can pull changes from your collaborators and merge them with your local version",
    },
    { 
        id: "push",
        title: "Push Updates",
        icon: "upload",
        button: "Push",
        blurb: "If your database is tracking one or more remote servers, you can push changes to your collaborators so that they can see your latest work and merge it with their own changes",
    },
    { 
        id: "share",
        title: "Share",
        icon: "share-alt",
        button: "Share",
        blurb: "Securely Share your database with your collaborators all over the world through TerminusDB Hub"
    }
]

export const PULL_FORM = {
    fields: [
        {
            id: "remote",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Choose Remote",
                options: [{value: "origin", label: "Origin"}, {value: "backup", label: "HQ"}]
            },
            label: 'Remote Repository'
        }
    ],
    buttons: {
        submitText: "Pull Changes"
    }
}

export const PUSH_FORM = {
    fields: [
        {
            id: "remote",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                placeholder: "Choose Remote",
                options: [{value: "origin", label: "Origin"}, {value: "backup", label: "HQ"}]
            },
            label: 'Remote Repository'
        }
    ],
    buttons: {
        submitText: "Push Changes"
    }
}