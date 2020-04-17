import { WOQL_JS, WOQL_JSON, WOQL_PY } from '../../labels/queryFormats'
const TerminusClient = require('@terminusdb/terminus-client');

export const formatQuery = (q, mode) => {
    var serial = serialise(q, mode);
    return serial;
}

const serialise = (q, mode) => {
    switch(mode){
        case WOQL_JS:
            return q.prettyPrint(4);
        case WOQL_JSON:
            return JSON.stringify(q.json(), undefined, 2);
        case WOQL_PY:
            return 'something in python'; //not sure what module
    }
}

export const parseText = (text, format) =>{
	const View = TerminusClient.View;
    switch(format){
        case WOQL_JSON:
            const pText = JSON.parse(text);
            return View.loadConfig(pText);
        case WOQL_JS:
            return eval(text);
    }
}
