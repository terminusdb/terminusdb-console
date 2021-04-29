import TerminusClient from '@terminusdb/terminusdb-client'

export async function getDBInfo(woqlClient,meta){
    const clientTools = new TerminusClient.WOQLClientTools(woqlClient)

    const newMeta = await clientTools.enrichLocalDB(meta.organization, meta.id)

    if(newMeta.remote_url){
        if( _is_local_clone(woqlClient, newMeta.remote_url)){                        
            let remoteSource = newMeta.remote_url.substring(newMeta.remote_url.lastIndexOf("/")+1)          
            const dbSourceInfo = woqlClient.databaseInfo(remoteSource)
            //if(newMeta.id === remoteSource){
            append_remote_record(newMeta, dbSourceInfo) 
            newMeta.type = 'local_clone'
        }
        else {
            if(!newMeta.type) newMeta.type = 'clone'
        }
    }
    else {
        newMeta.type = 'local'
    } 
    
    return newMeta
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
    if(roles.indexOf('create') === -1){
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
    //console.log("LOCAL + REMOTE",JSON.stringify(local,null,4))
    return local
}


function _is_local_clone(woqlClient, rem){
    let lhs = rem.substring(0, woqlClient.server().length)
    let rhs = woqlClient.server()
    return lhs === rhs
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