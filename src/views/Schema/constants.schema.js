export const FAILED_LOADING_SCHEMA_CLASSES = {
    id: "FAILED_LOADING_SCHEMA_CLASSES",
    color: "danger",
    title: "Failed to load schema classes",
    message: "An error occurred while loading classes"
}

export const GRAPHS_LOAD_ERROR = {
    id: "GRAPHS_LOAD_ERROR",
    color: "danger",
    title: "Failed to load graphs",
    message: "An error occurred while loading the list of database graphs"
}

export const FAILED_LOADING_OWL = {
    id: "GRAPHS_LOAD_ERROR",
    color: "danger",
    title: "Failed loading triples",
    message: "An error occurred while loading the triples from the graph"
}


export const DELETE_ICON_CSS = "tcf-delete-icon"

export const CLASSES_QUERY_LIMIT = 200
export const PROPERTIES_QUERY_LIMIT = 200


/* schema tabs */
export const CLASSES_TAB = "Classes"
export const PROPERTIES_TAB = "Properties"
export const OWL_TAB = "OWL"
export const GRAPHS_TAB = "Graphs"
export const PREFIXES_TAB = "URL Prefixes"

export const MERGE_BUTTON = "Merge"
export const PREFIXES_BUTTON = "URI Prefixes"
export const GRAPHS_BUTTON = "Graphs"
export const BRANCH_BUTTON = "Branch"
export const FORK_BUTTON = "Fork"

/* Graph Filter */
export const GRAPH_FILTER_CSS = "graph-filter"
export const GRAPH_FILTER_CONTAINER = "graph-filter-container"
export const ALL_SCHEMA_GRAPHS = "All Schema Graphs"
export const ALL_INFERENCE_GRAPHS = "All Inference Graphs"
export const SCHEMA_GRAPH = "Schema Graph"
export const INFERENCE_GRAPH = "Inference Graph"



export const TERMINUS_GRAPHS_BLURB = "TerminusDB databases are divided internally into one or more named graphs. This gives you greater control over data-integration but comes at the cost of complexity."
export const TERMINUS_GRAPHS_TITLE = "Graph Management"

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

export const TOOLBAR_CSS = {
    container: "schema-toolbar",
    messageCol: "schema-toolbar-messages",
    createCol: "schema-toolbar-create",
    graphCol: "schema-toolbar-graphs",
    actionButton: "schema-toolbar-action",
    editOWLButton: "schema-toolbar-edit schema-toolbar-action",
    createGraphButton: "schema-toolbar-create-button schema-toolbar-action",
    updateContainer: "schema-edit-toolbar",
    updateReportContainer: "schema-edit-report",
    cancelOWLButton: "schema-toolbar-cancel",
    updateOWLButton: "schema-toolbar-update",
    commitMsgCol: "schema-toolbar-commitcol",
    commitLabelCol: "schema-toolbar-labelcol",
    commitInput: "schema-toolbar-commit-input",
    messageContainer: "schema-toolbar-message-container",
    submitButtonsCol: "schema-toolbar-submits"
}

export const SUBMIT_INPUT_LABEL = "Commit Log"

export const EDIT_OWL_BUTTON = "Edit OWL"
export const CANCEL_OWL_BUTTON = "Cancel"
export const UPDATE_OWL_BUTTON = "Save Changes"
export const COMMIT_PLACEHOLDER = "Enter a brief description of the update and its purpose"

export const TAB_SCREEN_CSS = "tab-co"

export const OWL_CSS = {
    readContainer: "owl-editor-read",
    writeContainer: "owl-editor-write"
}

export const CLASS_TABLE_INFO_MSG = "Classes define the different types of data objects that you can save in your database"
export const PROPERTIES_TABLE_INFO_MSG = "Properties are attached to classes, they point to data of a specific type"
export const OWL_INFO_MSG = "OWL, the ontology web language, can be used directly to view and edit schema and inference rules"
export const GRAPHS_INFO_MSG = "Graphs are internal database partitions where data and rules are stored separately"
export const GRAPHS_CREATE_INFO = "Choose the type of graph you want to create and a name for it and a commit message"
export const UPDATE_TURTLE_SUCCESS = "Successfully updated OWL"
export const UPDATE_TURTLE_ERROR = "Failed to update OWL"
export const DEFAULT_TURTLE_UPDATE_MSG = "Console update triples interface updated "

export const CREATE_GRAPH_BUTTON = "Create New Graph"

export const PREFIXES = {
    createInfo: "", 
    info: "All data and schema elements are named with IRIs which can use prefixes. doc and scm are the default IRIs used for storing data and schema elements",
    builtinSectionCSS: "",
    builtinHeaderCSS: "",
    builtinHeader: "Built In Namespaces (Language Basics and Internal Data-structures)"
}


export const TERMINUS_PREFIXES_BLURB = "TerminusDB stores all data as RDF which uses URLs (IRIs more accurately) to give data global addressability and namespace protection. You can choose what URLs the data in your database will use."
export const TERMINUS_PREFIXES_TITLE = "URI Prefix Management"

export const CREATE_PREFIX_FORM = {
    prefixCreatedLocation: "(Console, Graph Create)",
    createSuccess: "Prefix Successfully Added",
    createFailure: "Failed to add prefix",
    fields: [
        {
            id: "prefix",
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter Prefix"
            },
            label: 'Prefix',
        },
        {
            id: "uri",
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter Full URL",
            },
            label: 'URI',
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
        submitText: "Create New Prefix"
    }
}
