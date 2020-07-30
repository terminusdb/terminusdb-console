
export const SHOW_CLASSES_PROPERTIES = 'WOQL.and(' + '\n' +
	'WOQL.lib().properties(),' + '\n' +
    'WOQL.lib().classes())'


export const DOCUMENT_META_DATA = 'WOQL.lib().document_classes()'

export const ADD_DOCTYPE_TEST = 'WOQL.doctype("scooter")'
export const ADD_DOCTYPE_SECOND_TEST = 'WOQL.doctype("skates")'

export const IMPORT_AND_EXPORT_CSV = 'WOQL.put(' + '\n' +
    'WOQL.as("Sku", "v:Sku")' + '\n' +
        '.as("date_added", "v:Date"),' + '\n' +
    'WOQL.and(' + '\n' +
    'WOQL.get(' + '\n' +
        'WOQL.as("sku", "v:Sku")' + '\n' +
            '.as("date_added", "v:Date")' + '\n' +
            '.as("category", "v:Category")' + '\n' +
    ').file("/app/local_files/MOCK_DATA.csv"),' + '\n' +
        'WOQL.eq("v:Date", "1970-01-01T00:00:00"),' + '\n' +
        'WOQL.eq("v:Category", "widgets")' + '\n' +
    '), WOQL.file("/app/local_files/warbeled_widgets.csv"))'
