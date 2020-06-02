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


export const TAB_SCREEN_CSS = "tab-co"


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

export const TERMINUS_PREFIXES_BLURB = "TerminusDB stores all data as RDF which uses URLs (IRIs more accurately) to give data global addressability and namespace protection. You can choose what URLs the data in your database will use." 
export const TERMINUS_PREFIXES_TITLE = "URI Prefix Management"



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


export const COMMIT = {
    act: {
        label: {
            htmlFor: "commit",
            text: 'Commit',
            className: "form"
        },
        input: {
            placeholder: "Commit message",
            name: "commit",
            className: "form"
        },
        error: {
            text: "Cannot be blank.",
            className: "errors"
        }
    },
    action: {
        type: "submit",
        className: "btn btn-primary lead mt-4",
        text: "Commit"
    }
}


export const EDIT_SCHEMA = {
    edit: {
        type: "submit",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Edit"
    },
    cancel: {
        type: "cancel",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Cancel"
    },
    update: {
        type: "update",
        className: "btn btn-primary lead mt-4 formMrg",
        text: "Update"
    }
}
