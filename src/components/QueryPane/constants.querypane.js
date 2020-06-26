export const WOQL_EDITOR_THEME = 'mdn-like'
export const WOQL_VIEWER_THEME = 'mdn-like'
export const HIDE_QUERY_EDITOR = 'Hide Query Editor'
export const SHOW_QUERY_EDITOR = 'Show Query Editor'
export const SHOW_VIEW_EDITOR = 'Show View Editor'
export const HIDE_VIEW_EDITOR = 'Hide View Editor'
export const QUERY_SUBMIT = 'Run Query'
export const EDIT_THIS_VERSION = "Edit this version"
export const LANGUAGE_NAMES = {js: "WOQL.js", python: "WOQL.py", json: "JSON-LD"}
export const LANGUAGE_DROPDOWN = "Language Views"

export const ELEMENTS_ID={
    RESULT_DROPDOWN:'result_dropdown'

}

export const EDITOR_READ_OPTIONS = {
    noHScroll: false,
    readOnly: true,
    lineNumbers: true,
    theme: "mdn-like"
}

export const EDITOR_WRITE_OPTIONS = {
    noHScroll: false,
    autoCursor:false,
    theme: "mdn-like",
    lineNumbers: true
}

export const QUERY_PANEL_TITLE = "Query"
export const QUERY_PANE_INTRO = "Please enter your query in the box below"

export const TABLE_VIEW = "Table"
export const GRAPH_VIEW = "Graph"



export const COMMIT_BOX = {
    label: {
        text: "As this query contains an update, you must provide a commit"
                + " message, to explain the reason for the change",
        className: "form"
    },
    input: {
        placeholder: "Enter reason for update here",
        name: "commitMessage",
        id: "commitMessage",
        className: "form"
    },
    confirm: {
        type: "submit",
        text: "Confirm"
    },
    cancel: {
        type: "cancel",
        text: "Cancel"
    }
}


export const QUERY_EDITOR_LABEL ={
    syntaxErrorMessage:"Parse error: Syntax error "
}

export const TOOLBAR_CSS = {
    containerRow: "query-pane-toolbar",
    edit: "query-pane-edit",
    row: "query-pane-toolbar-row",
    queryPaneControls: "query-pane-controls",
    runQuery: "run-query-button",
    dropdown:"query-pane-menu",
    rowHeight: "query-pane-dropdown-row"
}
