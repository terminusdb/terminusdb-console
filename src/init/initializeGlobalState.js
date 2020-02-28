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
    dbClient.connect(opts.server, opts.key, opts.db, opts.branch)
        .then(function(response){
        setGlobalState(TERMINUS_CLIENT, dbClient);
    }).catch((err)=>{
        console.log(err)
    })
};

export {useGlobalState};
