export const CREATE_DB_FORM = {
    labelClassName: "form",
    inputClassName: "form",
    errorClassName: "errors",
    helpClassName: "create-form-helptext",
    requiredField: "is a required field",
    createButtonClassName: "btn btn-primary lead mt-4",
    advancedWrapperClassName: "advanced-settings-create-form",
    advancedButtonClassName: "advanced-button btn-minor lead mt-4 btn",
    advancedSectionClassName: "advanced-section-create-form",
    graphsRowClassName: "graph-row-create-form",
    checkboxWrapperClassName: "checkbox-wrapper-create-form",
    checkboxLabelClassName: "checkbox-label-create-form",
    checkboxClassName: "checkbox-create-form",
    createButtonText: "Create New Database",
    hideAdvanced: "Hide Advanced Settings",
    showAdvanced: "Show Advanced Settings",
    schemaGraphCommitMessage: "Main Schema Graph Created by console during DB create",
    instanceGraphCommitMessage: "Main Instance Graph Created by console during DB create",
    instanceFailedSchemaWorkedMessage: " and schema graph main, but failed to create instance graph",
    schemaFailedMessage: " but failed to create main schema graph",
    instanceFailedSchemaWorkedMessage: " created main schema graph but failed to create main instance graph. You must create an instance graph before you can add data to this database",
    noDataGraphMessage: " Database has no instance graph.  You must create an instance graph before you can add data to this database",
    noSchemaGraphMessage: " Database is schema free. If you want to enable quality control and advanced WOQL features, you must add a schema to this database",
    instanceFailedMessage: "but failed to create main instance graph",
    noGraphMessage: " Empty Database - at least one graph must be created before anything can be stored in this database.",
    createFailureMessage: "Failed to Create Database",
    createSuccessMessage: "Successfully Created Database: ",
    fields: {
        dbid: {
            label: 'Database ID',
            help: "The database ID forms part of the URL - spaces are not allowed, simple ids using only alphanumerics and underscores are encouraged",
            placeholder: "Enter ID of new database"
        },
        dbname: {
            label: 'Database Name',
            help: "Choose A short but distinctive name that allows you to easily understand what's in the database",
            placeholder: "Enter name new database"
        },
        description: {
            label: 'Description',
            placeholder: "Enter a short text describing the database, its scope and purpose",
        },
        schema: {
            label: 'Create Schema Graph',
            help: "By default, databases are created with a schema graph (for defining rules about stored data) and an instance graph (for storing the data itself). If you do not wish to create these graphs (for example if you want a schema-free database or a schema-only database for storing libraries), uncheck the boxes here. You can always create them later.",
            placeholder: "Create Schema Graph (main)",
        },
        instance: {
            label: 'Create Instance Graph',
            help: "By default, databases are created with a schema graph (for defining rules about stored data) and an instance graph (for storing the data itself). If you do not wish to create these graphs (for example if you want a schema-free database or a schema-only database for storing libraries), uncheck the boxes here. You can always create them later.",
            placeholder: "Create Instance Graph (main)",
        },
        data_url: {
            label: 'Base URL for Data',
            placeholder: "Leave Blank to use default URI",
            help: "All data in TerminusDB is addressable by URL - you can choose the default URL prefix that you want to use for your internal data. This can be useful, for example, if you want to create a linked data application where all data is dereferencable",
        },
        schema_url: {
            label: 'Schema Base URL',
            placeholder: "Leave Blank to use default URI",
            help: "Every TerminusDB database has a local namespace scm: available for defining local schema elements. You can choose the URL that you want this prefix to derefence to - this allows you to make your schemata dereferencable at the URL of your choice.",
        }
    }
}
