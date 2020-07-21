import React from 'react'
import {Alert} from 'reactstrap'

export const COMMIT_LOG_FORM = {
    fields: [
        {
            id: 'commitlog',
            label: 'Commit Log ID',
            mandatory: true,
            value: '',
            inputElement: {
                type: 'input',
                placeholder: 'your@email',
            },
        },
    ],
    buttons: {
        submitText: 'Create Commit Log ID',
    },
}

export const TUTORIAL_SECTIONS = [
    {
        id: 'intro',
        title: 'TerminusDB: an introduction to revision control databases ',
        icon: 'stamp',
        button: 'Watch Introduction Video',
        blurb: 'TerminusDB is a revision control database, this means that it allows you and your collaborators to create and update many different versions of the same database in a controlled way. Learn more about the amazing time-travel, branching, merging and collaboration possibilities here',
    },
    {
        id: 'collaboration',
        title: 'TerminusDB & TerminusDB Hub: Enabling Complex Collaboration',
        icon: 'hdd',
        button: 'View Collaboration Video',
        blurb:
            'The revision control features supported by TerminusDB have one goal in mind - to make it easy for large teams to collaborate on complex data management problems. Find out more about how the revision control features of TerminusDB and TerminusDB hub can allow your team to collaborate more easily no matter where you are',
    },
    {
        id: 'timetravel',
        title: 'Time Traveling Queries',
        icon: 'code-branch',
        button: 'Watch Time-Travel Video',
        blurb:
            'Time travel allows you to return to any historical state of the database and query the data exactly as it was then. This is very useful if you really want to track who changed what over time and want the ability to look back to see precisely why any changes were made and by whom. Learn more about the amazing time-travelling abilities of TerminusDB here',
    },
    {
        id: 'branchmerge',
        title: 'Branching and Merging',
        icon: 'infinity',
        button: 'Watch Branching and Merging Video',
        blurb:
            'TerminusDB allows you to create multiple simultaneous versions of the same database by creating branches which can be edited independently with the changes merged together whenever you want.  TerminusDB has a very flexible branching structure, which allows you to create branches for both schema and instance data changes. This makes a large number of opertations on data easy that were before very hard. Find out more here',
    },
    {
        id: 'pushpull',
        title: 'Pushing & Pulling',
        icon: 'hdd',
        button: 'Watch Pushing and Pulling Video',
        blurb:
            'This will permanently remove this database and all its contents from the system - be careful not to delete any data that might be important in the future!',
    },
    {
        id: 'importing',
        title: 'Importing data into TerminusDB',
        icon: 'hdd',
        button: 'Watch Data Import Video',
        blurb:
            'TerminusDB allows you to easily transform messy data from external sources into a clean and consistent structure. Learn more about how to import and clean data here',
    },
    {
        id: 'query',
        title: 'The Web Object Query Language',
        icon: 'hdd',
        button: 'Watch WOQL Video',
        blurb:
            'TerminusDB supports WOQL, a powerful query language, which allows very expressive queries with very good performance on datasets up to 10s of billions of entries. Learn more about WOQL and the in-memory graph architecture that TerminusDB uses to get such good performance',
    },
    {
        id: 'schema',
        title: 'Schema Definition Language - OWL',
        icon: 'hdd',
        button: 'Watch WOQL Video',
        blurb:
            'OWL, the Web Ontology Language, is an extremely rich language for defining and constraining data - learn more about how you can use OWL to better describe your data and ensure that it stays correct over time.',
    },
]

export const SERVER_SECTIONS = [
    {
        id: 'details',
        title: 'Software Version',
        icon: 'stamp',
        button: 'Edit Configuration',
        blurb:
            'Running terminusdb-console version 1.0.1, connected to terminusdb-server version 2.1.0, Server Press # X',
    },
    {
        id: 'terminus',
        title: 'Server Administration Database',
        icon: 'hdd',
        button: 'View System DB',
        blurb:
            'TerminusDB uses an internal system database - to store its most important meta-data - databases, users and permissions. View the system database here',
    },
]

export const FAILED_LOADING_USERS = {
    id: 'FAILED_LOADING_USERS',
    color: 'danger',
    title: 'Failed to load list of users',
    message: 'An error occurred while loading the list of users on the server',
}

export const SETUP_FORM = {
    fields: [
        {
            id: 'adminid',
            value: '',
            helpCols: 7,
            label: 'Admin User ID',
            help: 'No spaces, alphanumerics only',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'Enter ID of new admin user',
            },
        },
        {
            id: 'password',
            label: 'Password',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'Password for connecting to the console',
            },
        },
        {
            id: 'display',
            label: 'Display Name',
            value: '',
            inputElement: {
                type: 'input',
                placeholder: 'the name that will appear in menus, etc',
            },
        },
        {
            id: 'commitlog',
            label: 'Commit Log ID',
            mandatory: true,
            value: '',
            inputElement: {
                type: 'input',
                placeholder: 'your@email',
            },
        },
    ],
    buttons: {
        submitText: 'Create Administrator Account',
    },
}

export const ORGANIZATION_FORM = {
    fields: [
        {
            id: 'id',
            value: '',
            helpCols: 7,
            label: 'Organization ID',
            help: 'No spaces, alphanumerics only',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'Enter ID of new organization',
            },
        },
        {
            id: 'label',
            label: 'Display Name',
            value: '',
            inputElement: {
                type: 'input',
                placeholder: 'the name that will appear in menus, etc',
            },
        },
        {
            id: "icon",
            label: 'Icon',
            inputElement: {
                type: "input",
                placeholder: "Enter URL of an icon to use for your database"
            }
        },  
        {
            id: "type",
            label: 'Organization Type',
            mandatory: true,
            inputElement: {
                type: "select",
                options: [
                    {value: "Personal", label: "Personal"}, 
                    {value: "Professional", label: "Professional"},
                    {value: "Team", label: "Team"},
                    {value: "Enterprise", label: "Enterprise"},
                    {value: "Public", label: "Public Interest"}
                ],
                placeholder: "Select Organization Type"
            }
        },      
        {
            id: 'comment',
            label: 'Description',
            value: '',
            inputElement: {
                type: 'textarea',
                placeholder: 'Enter basic description of organization, its purpose, etc',
            },
        },
    ],
    buttons: {
        submitText: 'Create Organization',
    }
}

export const ADD_COLLABORATORS_FORM = {
    fields: [{
            id: "database",
            value: "",
            label: "Database",
            mandatory: true,
            inputElement: {
                type: "select",
                options: [],
                placeholder: "Select Database"
            },
        },
        {
            id: "permission",
            value: "",
            mandatory: true,
            inputElement: {
                type: "select",
                options: [
                    {value: "read", label: "Read"}, 
                    {value: "write", label: "Write"},
                    {value: "manage", label: "Manage"}
                ],
                placeholder: "Select Permission to Grant"
            },
            label: 'Permission'
        },
        {
            id: "users",
            inputElement: {
                placeholder: "comma seperated list of user ids or email addresses",
                type: "textarea",
            },
            label: 'Collaborator IDs'
        },
        {
            id: "invitation",
            inputElement: {
                placeholder: "Introductory note to send to user",
                type: "textarea",
            },
            label: 'Introduction Note'
        }
    ],
    buttons: {
        submitText: "Add Collaborators",
    }
}

export const ADD_USER_FORM = {
    fields: [
        {
            id: 'uid',
            value: '',
            helpCols: 7,
            label: 'User ID',
            help: 'No spaces, alphanumerics only',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'Enter ID of new user',
            },
        },
        {
            id: 'password',
            label: 'Password',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: '',
            },
        },
        {
            id: 'commitlog',
            label: 'Commit Log ID',
            mandatory: true,
            value: '',
            inputElement: {
                type: 'input',
                placeholder: 'your@email',
            },
        },
        {
            id: 'display',
            label: 'Display Name',
            value: '',
            inputElement: {
                type: 'input',
                placeholder: 'the name that will appear in menus, etc',
            },
        },
        {
            id: 'notes',
            label: 'Notes',
            value: '',
            inputElement: {
                type: 'textarea',
                placeholder: 'You can attach notes to users to aid administration',
            },
        },
    ],
    buttons: {
        submitText: 'Create User',
    },
}

export const GRANT_FORM = {
    fields: [
        {
            id: 'uiri',
            value: '',
            helpCols: 7,
            label: 'User IRI',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'Enter IRI of user doc which will receive role',
            },
        },
        {
            id: 'roleid',
            label: 'Role ID',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'the IRI of the role to grant',
            },
        },
    ],
    buttons: {
        submitText: 'Grant Role To User',
    },
}

export const REVOKE_FORM = {
    fields: [
        {
            id: 'uid',
            value: '',
            helpCols: 7,
            label: 'User IRI',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'Enter IRI of user to revoke role from',
            },
        },
        {
            id: 'roleid',
            label: 'Role ID',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'the ID of the role to revoke',
            },
        },
    ],
    buttons: {
        submitText: 'Revoke Role',
    },
}

export const CREATE_ROLE_FORM = {
    fields: [
        {
            id: 'roleid',
            label: 'Role ID',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'the IRI of the role to create',
            },
        },
        {
            id: 'label',
            label: 'Role Name',
            value: '',
            inputElement: {
                type: 'input',
            },
        },
        {
            id: 'description',
            label: 'Description',
            value: '',
            inputElement: {
                type: 'textarea',
            },
        },
    ],
    buttons: {
        submitText: 'Create Role',
    },
}


export const CLONE_URL_FORM = {
    fields: [
        {
            id: 'url',
            label: 'URL',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'Enter the URL of the TerminusDB database you wish to clone',
            },
        }
    ],
    buttons: {
        submitText: 'Clone from URL',
    },
}

export const GRANT_CAP_FORM = {
    fields: [
        {
            id: 'capid',
            label: 'Capability ID',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'the IRI of the capability',
            },
        },
        {
            id: 'roleid',
            label: 'Role ID',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'the IRI of the role to grant the capability to',
            },
        },
    ],
    buttons: {
        submitText: 'Grant Capability To Role',
    },
}

export const CREATE_CAP_FORM = {
    fields: [
        {
            id: 'capid',
            label: 'Capability ID',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'input',
                placeholder: 'the IRI of the Capability to create',
            },
        },
        {
            id: 'label',
            label: 'Capability Name',
            value: '',
            inputElement: {
                type: 'input',
            },
        },
        {
            id: 'resources',
            label: 'Resources',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'textarea',
            },
        },
        {
            id: 'permissions',
            label: 'Permissions',
            value: '',
            mandatory: true,
            inputElement: {
                type: 'textarea',
            },
        },
        {
            id: 'description',
            label: 'Description',
            value: '',
            inputElement: {
                type: 'textarea',
            },
        },
    ],
    buttons: {
        submitText: 'Create Capability',
    },
}

export const COMMIT_LOG_WHATIS = (
    <div className="setup-meat">
        The Commit Log ID is the author id message that is stored in the commit log of TerminusDB -
        if you want to be able to identify which updates came from which user, you want to choose an
        ID that is both universal and verifiable. Your <b>most commonly used email address</b> is
        normally <b>by far the best option</b>. It will allow you to easily share your databases
        with collaborators and they will be able to identify that it was you who made the updates.
        You can choose whatever ID string you want, but if you do not choose an ID that can be
        associated with you, the updates that you share with collaborators will always come through
        as unidentified and unverifiable. This ID is only needed to allow your collaborators to more
        easily identify your updates, and is only shared with them when you explicitly push changes
        that you have made to their databases. Otherwise it is stored privately in your database
        commit logs and is not available to anybody else, including TerminusDB ltd.
    </div>
)

export const COMMIT_LOG_EXPLANATION_CSS = ''
export const COMMIT_LOG_EXPLANATION = (
    <>
        <div className="setup-intro">
            Before you can start creating databases and sharing them with your collaborators, there
            is one first important step. TerminusDB allows large numbers of people create databases
            collaboratively. In most collaborative situations, keeping track of identity is
            important - knowing who made what changes.
        </div>
        <div className="setup-punch">
            You must define a new administrator user account for the server with an associated{' '}
            <strong>Commit Log ID</strong>
        </div>
        {COMMIT_LOG_WHATIS}
    </>
)

export const JUST_COMMIT_LOG_EXPLANATION = (
    <>
        <Alert color="danger">Missing Commit Log ID</Alert>
        {COMMIT_LOG_WHATIS}
    </>
)

export const ADMIN_ACCOUNT_NOTES = 'Administrator Account set up with TerminusDB console at '
export const CREATED_ADMIN_MESSAGE = 'Administrator account set up successfully'
export const FAILED_CREATING_ADMIN = 'Failed to create admin account'

