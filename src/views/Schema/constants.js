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

export const DELETE_ICON_CSS = "tcf-delete-icon"
