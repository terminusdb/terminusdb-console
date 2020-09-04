//Server Home Page
export const CREATEDB_TITLE = "Create"
export const DBLIST_TITLE  = "My Databases"
export const CREATE_FIRSTDB_CSS = "color-primary alert"
export const CREATE_FIRSTDB = ""
export const DBLIST_HEADER_CSS = "some-old-header-css"
export const CREATE_FIRSTUSER = "Set up"
export const CREATE_FIRSTUSER_CSS = ""
export const FAILED_LOADING_USERS = "Failed to load list of users on server"
export const ADD_COMMIT_ID_CSS = ""
export const ADD_COMMIT_ID_TITLE = "Set Commit Log ID"
export const TUTORIALS_CSS = ""
export const TUTORIALS_TITLE = "Tutorials"
export const MANAGE_USERS_CSS = ""
export const MANAGE_USERS_TITLE = "User Accounts"
export const MANAGE_SERVER_TITLE = "Server Configuration"
export const MANAGE_SERVER_CSS = ""
export const CLONEDB_TITLE = "Clone"




//Terminus DB Home Page
export const TERMINUS_HOME_TITLE = "TerminusDB - Terminus Database"
export const TERMINUS_HOME_ADVICE = "This is the TerminusDB Terminus Database. It stores the internal meta-data about users, roles, databases, etc. It should not be updated directly - treat with care."


//Document Page Level Error Messages
export const DOCUMENT_NO_SCHEMA = { 
    id: "DOCUMENT_NO_SCHEMA",
    color: "info",
    title: "Missing Schema Graph",
    message: "There is no schema defined for this database - before you can define and use documents, you need to create a schema for this database"    
}

export const SYSTEM_ERROR = { 
    id: "SYSTEM_ERROR",
    title: "System Error",
    color: "error",
    message: "Failed to load documents from database"    
}

export const NO_DOCUMENT = { 
    id: "NO_DOCUMENT",
    title: "Empty Database",
    color: "info",
    message: "No documents have been added to this database yet. "    
}

export const NO_DOCUMENT_CLASS = { 
    id: "NO_DOCUMENT_CLASS",
    title: "Missing Document Class",
    color: "info",
    message: "No document classes have been defined in the schema. Before you can view and create documents, you must define at least one document class in the database schema. "    
}

export const GRAPHS_LOAD_ERROR = { 
    id: "GRAPHS_LOAD_ERROR",
    color: "danger",
    title: "Failed to load graphs",
    message: "An error occurred while loading the list of database graphs"    
}


/* database home tabs */
export const DETAILS_TAB = 'Monitor'
export const SYNCHRONISE_TAB = 'Synchronize'
export const MANAGE_TAB = 'Manage'

/* schema tabs */
export const CLASSES_TAB = "Classes"
export const PROPERTIES_TAB = "Properties"
export const OWL_TAB = "Triples"
export const GRAPHS_TAB = "Graphs"
export const PREFIXES_TAB = "Prefixes"

// commit queries
export const GET_COMMITS = 'GET_COMMITS'



//Query Page
export const NEW_QUERY_BUTTON_TEXT = "Add New Query Pane"

//Profile Page 
export const PROFILE_BG_IMAGE = "https://terminusdb.com/img/placeholders/half-background-mobile.png"
export const USER_CARD_CSS = "user-card"
export const USER_DESCRIPTION_FILLER = "..." 
export const PROFILE_TITLE = "Profile"
export const PROFILE_CONTENT_CSS = "some-css"


//Login Page
export const LOGIN_LOGO = "https://terminusdb.com/img/logos/logo.svg"
export const LOGIN_PLACEHOLDER = "Enter valid TerminusDB password"
export const LOGIN_PROMPT = "Please enter your password"
export const CONNECT_PROMPT = "Connect"

export const CLONEDBS = [{
    id: "",
    organization: "terminators",
    label: "TerminusDB Bike Tutorial",
    comment: "This is a web-hosted version of the bike tutorial which is commonly used as our first introduction to knowledge graphs. This is a version of the tutorial pre-loaded into TerminusDB that you can clone to your own database and  ",
    public: true,
    testing: true,
    icon: "https://coynecycles.ie/wp-content/uploads/2020/02/Claud-Butler-Cape-Wrath-web.jpg",
    remote_url: "https://hub.terminusdb.com/kevin/bikes",
    remote_record: {
        public: true,
        icon: "https://coynecycles.ie/wp-content/uploads/2020/02/Claud-Butler-Cape-Wrath-web.jpg",
        id: 'bikes',
        organization: 'kevin',
        label: "TerminusDB Bike Tutorial",
        organization_type: "Terminators",
        organization_label: "TerminusDB Tutorials",
    }
},
{
    id: "",
    organization: "terminators",
    label: "TerminusDB Politicians Tutorial",
    comment: "This is a web-hosted version of the politicians tutorial which is commonly used as one of our first introduction to knowledge graphs. This is a version of the tutorial pre-loaded into TerminusDB that you can clone to your own database",
    public: true,
    testing: true,
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRP9zVENPlG4mT_yqOq6kstuLtq9WkhoZIAHw&usqp=CAU",
    remote_url: "https://hub.terminusdb.com/gavin/dublin_voting",
    remote_record: {
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRP9zVENPlG4mT_yqOq6kstuLtq9WkhoZIAHw&usqp=CAU",
        public: true,
        id: 'dublin_voting',
        organization: 'gavin',
        label: "TerminusDB Politicians Tutorial",
        organization_type: "Terminators",
        organization_label: "TerminusDB Politicians Tutorials",
    } 
}]


export const LIST_LOCAL = "Showing all of the databases currently installed on your local Terminusdb server"
export const LIST_REMOTE = "Showing all of the combined databases from your Terminus Hub account and your local Terminusdb server combined"
export const CLONE = "Recommended for you: public databases that you can clone directly from Terminus Hub. Choose from the list below"


export const CLONE_URL_FORM = {
    fields: [
        {
            id: "url",
            label: 'Clone URL',
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter URL of TerminusHub Database to Clone"
            }
        }
    ],
    buttons: {
        submitText: "Clone From URL"
    }
}

export const COLLABORATE_TITLE = "Collaborate"
