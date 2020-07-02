import { BIKES_CREATE_SCHEMA_QUERY,
	BIKES_CSV, BIKES_WRANGLES,
	BIKES_INSERTS,
	BIKES_SELECT_DOCUMENTS} from "../constants/bikes-data-constants"
import { POLITICAL_DATA_SCHEMA_QUERY,
	POLITICAL_DATA_CSV,
	POLITICAL_DATA_WRANGLES,
	POLITICAL_DATA_INSERTS,
	POLITICAL_SHOW_DOCUMENTS } from "../constants/political-data-constants"
import { DUBLIN_COUNCIL_DATA_SCHEMA_QUERY,
	DUBLIN_COUNCIL_DATA_CSV, 
	DUBLIN_COUNCIL_DATA_WRANGLES,
	DUBLIN_COUNCIL_DATA_INSERTS,
	DUBLIN_COUNCIL_SHOW_DOCUMENTS } from "../constants/dublin-council-data-constants"


export const config = [{
		"name": "bikes-tutorial" + Date.now(),
		"addSchema": BIKES_CREATE_SCHEMA_QUERY,
		"loadDocuments": {
			"csv": BIKES_CSV,
			"wrangles": BIKES_WRANGLES,
			"inserts": BIKES_INSERTS
		},
		"queries": {
			"selectDocuments": BIKES_SELECT_DOCUMENTS
		}
	},
	{
		"name": "political-tutorial" + Date.now(),
		"addSchema": POLITICAL_DATA_SCHEMA_QUERY,
		"loadDocuments": {
			"csv": POLITICAL_DATA_CSV,
			"wrangles": POLITICAL_DATA_WRANGLES,
			"inserts": POLITICAL_DATA_INSERTS
		},
		"queries": {
			"selectDocuments": POLITICAL_SHOW_DOCUMENTS
		}
	},
	{
		"name": "dublin-council-tutorial" + Date.now(),
		"addSchema": DUBLIN_COUNCIL_DATA_SCHEMA_QUERY,
		"loadDocuments": {
			"csv": DUBLIN_COUNCIL_DATA_CSV,
			"wrangles": DUBLIN_COUNCIL_DATA_WRANGLES,
			"inserts": DUBLIN_COUNCIL_DATA_INSERTS
		},
		"queries": {
			"selectDocuments": DUBLIN_COUNCIL_SHOW_DOCUMENTS
		}
	}]
