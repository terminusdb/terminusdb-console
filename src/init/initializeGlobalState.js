import { useState, useEffect } from "react";
import { createGlobalState } from 'react-hooks-global-state';
import TerminusClient from '@terminusdb/terminus-client';
import { TERMINUS_CLIENT } from '../labels/globalStateLabels'

const { setGlobalState, useGlobalState } = createGlobalState({
    TERMINUS_CLIENT: {}
});

export const setTerminusClient = (params) => {
    const opts = params || {};
    const dbClient = new TerminusClient.WOQLClient();
    return dbClient.connect(opts)
    	.then(function(response){
        	setGlobalState(TERMINUS_CLIENT, dbClient);
    })
};

export {useGlobalState};
