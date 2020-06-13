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
        blurb: "Pull changes from your collaborators and Push your changes to them to synchronise versions",
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
                type: "input",              
            },
            label: 'Remote Repository'
        }
    ],
    buttons: {
        submitText: "Pull Changes"
    }
}
