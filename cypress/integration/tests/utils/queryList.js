import { loadCSVs } from "./loadDocuments"

/*
creates bikes schema
*/
export const CREATE_SCHEMA = 'WOQL.when(true).and(' + '\n' +
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

export const SHOW_ALL_SCHEMA_ELEMENTS = 'WOQL.lib().elementMetadata()'

export const LOAD_DOCUMENTS = loadCSVs()
