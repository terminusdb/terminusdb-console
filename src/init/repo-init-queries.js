import React from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
/**
 * Functions that are always run at init time - they get the meta-data about available databases, etc.
 */

export async function enrich_local_db_listing(woqlClient){
    let dbs = woqlClient.databases()
    let usings = []
    for(var i = 0; i <dbs.length; i++){
        if( dbs[i].organization &&  dbs[i].id) usings.push('/' + dbs[i].organization + '/' + dbs[i].id) 
    }
    let sysClient = woqlClient.copy()
    sysClient.set_system_db()
    //let micro = Date.now()
    let res = await TerminusClient.WOQL.lib().assets_overview(usings, sysClient)
    let ndbs = dbs.map((item) => {
        for(var i = 0; i < res.length; i++){
            if(item.id == res[i].id){
                for(var k in res[i]){
                    item[k] = res[i][k]
                }
            }
        }
        return item
    })
    if(res) woqlClient.databases(ndbs)
    //alert(((Date.now() - micro)/1000) + " seconds")
}


