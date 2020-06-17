import { BIKES_CREATE_SCHEMA_QUERY, POLITICAL_DATA_SCHEMA_QUERY, LOAD_DOCUMENTS } from "./queryList"

export const config = [{
		"name": "bikes-tutorial",
		"schemaQuery": BIKES_CREATE_SCHEMA_QUERY
	},
	{
		"name": "political-tutorial",
		"schemaQuery": POLITICAL_DATA_SCHEMA_QUERY
	}]
