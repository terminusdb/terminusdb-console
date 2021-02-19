import React from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'


/**
 * Functions that are always run at init time - they get the meta-data about available databases, etc.
 */

export async function enrich_local_db_listing(woqlClient){
    let dbs = woqlClient.databases()
    let usings = []
    for(var i = 0; i <dbs.length; i++){
        if( dbs[i].organization &&  dbs[i].id) usings.push(dbs[i].organization + '/' + dbs[i].id) 
    }
    if(usings.length == 0) return
    let sysClient = woqlClient.copy()
    sysClient.setSystemDb()
    //let micro = Date.now()
    let res
    try {
        res = await TerminusClient.WOQL.lib().assets_overview(usings, sysClient, true)
    }catch(e){
        // eslint-disable-next-line no-console
        console.log(e)
        return 
    }
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
    for(var j = 0 ; j<ndbs.length; j++){
        if(ndbs[j].remote_url){
            if( _is_local_clone(woqlClient, ndbs[j].remote_url)){                        
                let dbid = ndbs[j].remote_url.substring(ndbs[j].remote_url.lastIndexOf("/")+1)
                for(var k = 0; k<ndbs.length; k++){
                    if(k == j) continue
                    if(ndbs[k].id == dbid){
                       ndbs[j] = append_remote_record(ndbs[j], ndbs[k]) 
                       ndbs[j].type = 'local_clone'
                    }
                }
            }
            else {
                if(!ndbs[j].type) ndbs[j].type = 'clone'
            }
        }
        else {
            ndbs[j].type = 'local'
        }            
    
    }
    if(res) woqlClient.databases(ndbs)
}

export function append_remote_record(local, remote){       
    local.type =  'remote'
    if(!local.label && remote.label) local.label = remote.label
    if(!local.comment && remote.comment) local.comment = remote.comment
    //calculated fields
    let lhs = local.updated || 0
    let rhs = remote.updated || 0
    let diff = (lhs - rhs)
    local.ahead = (diff > 0 ? diff : false)
    local.behind = (diff < 0 ? diff : false)
    local.structure_mismatch = !_branches_match(local.branches, remote.branches)
    let actions = []
    if(remote.public) actions.push('pull')
    let roles = remote.roles || []
    if(!Array.isArray(roles)) roles = Object.values(roles)
    if(roles.indexOf('create') == -1){
        actions.push('delete')                                
        if(actions.indexOf('pull') == -1) actions.push('pull')                                
        actions.push('push')                                
    }
    else if(roles.indexOf('write') == -1){
        if(actions.indexOf('pull') == -1) actions.push('pull')                                
        actions.push('push')                                
    }
    else if(roles.indexOf('read') == -1){
        if(actions.indexOf('pull') == -1) actions.push('pull')                                
    }
    remote.actions = actions
    local.remote_record = remote
    return local
}


function _is_local_clone(woqlClient, rem){
    let lhs = rem.substring(0, woqlClient.server().length)
    let rhs = woqlClient.server()
    return lhs == rhs
}


function _branches_match(a, b){
    if((!a && b) || (!b && a)) return false
    if(!a && !b) return true
    if(a.length != b.length) return false
    for(var i = 0; i<a.length; i++){
        let found = false
        for(var j = 0; j<b.length; j++){
            if(b[j].branch == a[i].branch){
                found = true
                continue
            }
        }
        if(!found) return false
    }
    return true
}