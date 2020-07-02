import React from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
/**
 * Functions that are always run at init time - they get the meta-data about available databases, etc.
 */

export function enrich_local_db_listing(woqlClient){
    let dbs = woqlClient.user_databases()
    let WOQL = TerminusClient.WOQL
    let p = WOQL.and()
    dbs.map((item, index) => {
        let using_str = '/' + item.organization + '/' + item.id + '/_meta'
        let varlist = [
            'Repo IRI_' + index, 
            'Repo Name_' + index, 
            'Repo Type_' + index,
            'Remote URL_' + index,
            'Repo Head IRI_' + index
        ]
        p.and(
            WOQL.lib().repos(false, varlist, using_str)
        )
        let using_str2 = '/' + item.organization + '/' + item.id + '/local/_commits'
        p.and(
            WOQL.opt().using(using_str2).limit(1).order_by("v:UpdatedTime_" + index + " asc").triple("v:CommitIRI_" + index, "ref:commit_timestamp", "v:UpdatedTime_" + index)
        )  
    })
    let sysClient = woqlClient.copy()
    sysClient.set_system_db() 
    return sysClient.query(p)
    .then((results) => {
        if(results && results.bindings && results.bindings.length){
            woqlClient.connection.repos = _extract_res_array(results.bindings, dbs)
        }
    })
}

export function enrich_remote_listing(remoteClient, localClient){
    return remoteClient.getRoles(remoteClient.uid())
    .then((roledata) => {
        return roledata
    })
}

function _extract_res_array(bindings, dbs) {
    let res = []
    for(var i = 0; i<bindings.length; i++){
        for(var varname in bindings[i]){
            if(bindings[i][varname]){
                let pos = varname.split("_")[1]
                let vname = varname.split("_")[0]
                if(!res[pos]) {
                    let debrec = dbs[pos]
                    if(debrec) res[pos] = {database: debrec.id, organization: debrec.organization }
                }
                if(res[pos]) res[pos][vname] = bindings[i][varname]
            }
        } 
    }
    return res
}

