import { loadCSVs } from "./loadDocuments"

/*
creates bikes schema
*/
export const BIKES_CREATE_SCHEMA_QUERY = 'WOQL.when(true).and(' + '\n' +
	'WOQL.doctype("Station")' + '\n' +
	    '.label("Bike Station")' + '\n' +
	    '.description("A station where municipal bicycles are deposited"),' + '\n' +
	'WOQL.doctype("Bicycle")' + '\n' +
	    '.label("Bicycle"),' + '\n' +
	'WOQL.doctype("Journey")' + '\n' +
	    '.label("Journey")' + '\n' +
	    '.property("start_station", "Station").label("Start Station")' + '\n' +
	    '.property("end_station", "Station").label("End Station")'+ '\n' +
	    '.property("duration", "integer").label("Journey Duration")' + '\n' +
	    '.property("start_time", "dateTime").label("Time Started")' + '\n' +
	    '.property("end_time", "dateTime").label("Time Ended")' + '\n' +
	    '.property("journey_bicycle", "Bicycle").label("Bicycle Used"))'

export const POLITICAL_DATA_SCHEMA_QUERY = 'WOQL.when(true).and('  + '\n' +
        'WOQL.doctype("Party")'  + '\n' +
            '.label("Party")'  + '\n' +
            '.description("Political Party"),'  + '\n' +
        'WOQL.doctype("Representative")'  + '\n' +
            '.label("Representative")'  + '\n' +
            '.description("An elected member of the US congress")'  + '\n' +
            '.property("member_of", "Party")'  + '\n' +
                '.label("Member of").cardinality(1),'  + '\n' +
        'WOQL.doctype("Similarity")'  + '\n' +
            '.label("Similarity")'  + '\n' +
            '.property("similarity", "decimal")'  + '\n' +
                '.label("Similarity")'  + '\n' +
            '.property("similar_to", "Representative")'  + '\n' +
                '.label("Similar To").cardinality(2),'  + '\n' +
        'WOQL.add_class("ArmedForcesSimilarity")'  + '\n' +
            '.label("Armed Forces")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("CivilRightsSimilarity")'  + '\n' +
            '.label("Civil Rights")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("HealthSimilarity")'  + '\n' +
            '.label("Health")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("ImmigrationSimilarity")'  + '\n' +
            '.label("Immigration")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("InternationalAffairsSimilarity")'  + '\n' +
            '.label("International Affairs")' + '\n' +
            '.parent("Similarity"),' + '\n' +
        'WOQL.add_class("TaxationSimilarity")' + '\n' +
            '.label("Taxation")' + '\n' +
            '.parent("Similarity"),' + '\n' +
        'WOQL.add_class("OverallSimilarity")' + '\n' +
            '.label("Overall")' + '\n' +
            '.parent("Similarity"))'

export const SHOW_CLASSES_PROPERTIES = 'WOQL.and(' + '\n' +
	'WOQL.lib().properties(),' + '\n' +
    'WOQL.lib().classes())'



export const DOCUMENT_META_DATA = 'WOQL.lib().documentMetadata()'

export const LOAD_DOCUMENTS = loadCSVs()

export const ADD_DOCTYPE_TEST = 'WOQL.doctype("scooter")'
export const ADD_DOCTYPE_SECOND_TEST = 'WOQL.doctype("skates")'
