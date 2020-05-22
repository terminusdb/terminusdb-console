export const CREATE_DB_FORM = {
    labelClassName: "form",
    inputClassName: "form",
    errorClassName: "errors",
    helpClassName: "create-form-helptext",
    requiredField: "is a required field",
    createButtonClassName: "btn btn-primary lead mt-4",
    graphsRowClassName: "graph-row-create-form",
    checkboxWrapperClassName: "checkbox-wrapper-create-form",
    checkboxLabelClassName: "checkbox-label-create-form",
    checkboxClassName: "checkbox-create-form",
    createButtonText: "Create New Database",
    schemaGraphCommitMessage: "Main Schema Graph Created by console during DB create",
    schemaFailedMessage: " but failed to create main schema graph",
    noSchemaGraphMessage: " Database is schema free. If you want to enable quality control and advanced WOQL features, you must add a schema to this database",
    noGraphMessage: " Empty Database - at least one graph must be created before anything can be stored in this database.",
    createFailureMessage: "Failed to Create Database",
    createSuccessMessage: "Successfully Created Database: ",
    fields: [
        {   
            id: "dbid",
            value: "",
            helpCols: 9,
            label: 'Database ID',
            help: "The database ID forms part of the URL - spaces are not allowed, simple ids using only alphanumerics and underscores are encouraged",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter ID of new database"
            }
        },
        {   
            id: "dbname",
            label: 'Database Name',
            value: "",
            mandatory: true,
            inputElement: {
                type: "input",
                placeholder: "Enter name of new database"
            }
        },
        {
            id: "description",
            label: 'Description',
            value: "",
            inputElement: {
                type: "textarea",
                placeholder: "Enter a short text describing the database, its scope and purpose",
            },
        },
    ],
    buttons: {
        submitText: "Create New Database"
    }
}

export const CREATE_DB_ADVANCED = {
    advancedWrapperClassName: "advanced-settings-create-form",
    advancedButtonClassName: "advanced-button btn-minor lead mt-4 btn",
    advancedSectionClassName: "advanced-section-create-form",
    hideAdvanced: "Hide Advanced Settings",
    showAdvanced: "Show Advanced Settings",    
    fields: [
        {
            id: "schema",
            value: true,
            label: 'Create Schema Graph',
            helpCols: 9,
            help: "By default, databases are created with a schema graph for defining rules about stored data. If you want a schema-free database, uncheck the box here.",
            inputElement: {
                label: "Create schema graph main",
                type: "checkbox"
            },
        },
        {
            id: "data_url",
            label: 'Base URL for Data',
            value: "",
            helpCols: 9,
            inputElement: {
                type: "input",
                placeholder: "Leave Blank to use default URI",
            },
            help: "All data in TerminusDB is addressable by URL - you can choose the default URL prefix that you want to use for your internal data. This can be useful, for example, if you want to create a linked data application where all data is dereferencable",
        },
        {   
            id: "schema_url",
            label: 'Base URL for schema elements',
            value: "",
            helpCols: 9,
            inputElement: {
                type: "input",
                placeholder: "Leave Blank to use default URI"
            },
            help: "Every TerminusDB database has a local namespace scm: available for defining local schema elements. You can choose the URL that you want this prefix to derefence to - by convention schema URLs end in a '#' character.",
        }
    ]
}

export const COPY_LOCAL_DB = {
    //advancedWrapperClassName: "advanced-settings-create-form",
    //advancedButtonClassName: "advanced-button btn-minor lead mt-4 btn",
    //advancedSectionClassName: "advanced-section-create-form",
    //hideAdvanced: "Hide Advanced Settings",
    //showAdvanced: "Show Advanced Settings",    
    fields: [
        {
            id: "dbsource",
            value: "",
            label: 'Copy From',
            inputElement: {
                type: "select",
                placeholder: "Choose Database to Copy",
            }
        }
    ]
}