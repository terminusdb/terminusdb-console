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

export const CREATE_GRAPH_FORM = {
    cancelButtonText: "Cancel",
    createButtonText: "Create New Graph",
    graphDeletedLocation: "(Console, Graph Delete)",
    graphCreatedLocation: "(Console, Graph Create)",
    createSuccess: "Graph Successfully Created",
    createFailure: "Failed to Create Graph",
    fields: {
        gtype: {
            label: 'Graph Type',
            options: [{value: "schema", label: "Schema Graph"}, {value: "instance", label: "Instance Graph"}, {value: "inference", label: "Inference Graph"}],
            help: "Instance graphs contain data, schema graphs contain rules, inference graphs contain inference rules",
            placeholder: "Select Graph Type"
        },
        gid: {
            label: 'Graph ID',
            placeholder: "Enter ID of new graph",
            help: "A short simple string to identify the graph - no spaces or special characters allowed",
        },
        commit: {
            label: "Commit Message",
            placeholder: "A short description of the reason for your changes",
            help: "Along with saving history, TerminusDB saves messages with each change, describing the rationale, to help others understand in future",
        }
    }
}

export const DELETE_ICON_CSS = "tcf-delete-icon"