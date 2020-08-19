/**
 * Controller application for branch creation form
 */
import React from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'

/**
 * Meta has create db (id, label, comment, organization)
 */
export const CreateLocal = async (meta, client) => {  
    let dbs = client.databases()
    meta.id = _new_local_id(meta.id, dbs)
    if(!meta.label){
        meta.label = meta.id
    }
    meta.label = _new_local_label(meta.label, dbs)
    if(!meta.comment){
        meta.comment = ""
    }
    return client.createDatabase(meta.id, meta, meta.organization).then(() => meta.id)
}

export const CreateRemote = async (meta, client, remoteClient, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    client.remote_auth(creds)
    let rmeta = meta
    return remoteClient.createDatabase(meta.id, meta, meta.organization)
    .then((resp) => {
        //if(resp.url) rmeta.remote_url = resp.url
        if(!rmeta.roles) rmeta.roles = ['create']
        return CloneDB(rmeta, client, getTokenSilently)
    })
}

export const ForkDB = async (meta, client, remoteClient, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    client.remote_auth(creds)
    let rmeta = meta
    meta.fork = true
    meta.id = _new_remote_id(meta.id, meta.organization, remoteClient.databases())
    return remoteClient.createDatabase(meta.id, meta, meta.organization)
    .then((resp) => {
        if(resp.url) rmeta.remote_url = resp.url
        if(!rmeta.organization_roles) rmeta.organization_roles = ['create'] 
        return CloneDB(rmeta, client, getTokenSilently)
    })
}

export const isHubURL = function(hurl){
    if(hurl.indexOf("://hub") != -1) return true
    return false
}

export const isLocalURL = function(lurl, client){
    return _is_local_server(client, lurl)
}

export const DeleteDB = async (meta, client, remoteClient, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    return remoteClient.deleteDatabase(meta.remote_record.id, meta.remote_record.organization)
}


/*
* remote_url 
* id (local)
* label
* comment
*/
export const CloneDB = async (meta, client, getTokenSilently) => {
    let dbs = client.databases()
    //console.log(dbs)
    let url = meta.remote_url 
    let newid = meta.id
    if(!newid){
        newid = url.substring(url.lastIndexOf('/')+ 1)
    }
    newid = _new_local_id(newid, dbs)
    if(!meta.label){
        meta.label = newid
    }
    meta.label = _new_local_label(meta.label, dbs)
    if(!meta.comment){
        meta.comment = ""
    }
    if(_is_local_server(client, meta.remote_url)){
        client.remote_auth(client.local_auth())
    }
    else {
        const jwtoken = await getTokenSilently()
        client.remote_auth({type: "jwt", key: jwtoken})
    }
    return client.clonedb(meta, newid).then(() => newid)
}


export const AcceptInvite = async (meta, client, remoteClient, getTokenSilently) => {
    let msg = {invitation: {
        id: meta.remote_record.invitation_id, 
        action: "accept"
    }}
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    return remoteClient.updateUser(client.connection.user.logged_in, msg)    
}  

export const RejectInvite = async (meta, client, remoteClient, getTokenSilently) => {
    let msg = {invitation: {
        id: meta.remote_record.invitation_id, 
        action: "reject"
    }}
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    return remoteClient.updateUser(client.connection.user.logged_in, msg)    
}  

export const ShareLocal = async (meta, client, remoteClient, getTokenSilently) => {  
    let WOQL = TerminusClient.WOQL
    let remote_name = "origin"
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    client.remote_auth(creds)
    if(meta.schema) delete meta['schema']
    meta.id =  _new_remote_id(meta.id, meta.organization, remoteClient.databases(), true)
    return remoteClient.createDatabase(meta.id, meta, meta.organization)
    .then((resp) => { 
        let rem = resp.url || meta.remote_url
        let push_to = {
            remote: remote_name,
            remote_branch: "main",
            message: "publishing db content to hub via console",
        }
        let using = client.organization() + "/" + client.db() + "/_meta"
        let q = WOQL.lib().add_remote(using, rem, "origin")       
        return client.query(q, "Setting remote for sharing database on Terminus Hub")
        .then(() => {
            return client.fetch(push_to.remote).then(() => {
                client.push(push_to)
            })
        })
    })
}

export const addRemote = async (remote_name, remote_url, client, getTokenSilently) => { 
    let WOQL = TerminusClient.WOQL
    let using = client.organization() + "/" + client.db() + "/_meta"
    let q = WOQL.lib().add_remote(using, remote_url, remote_name)       
    let res = await client.query(q, `Adding remote ${remote_name} at ${remote_url}`)
    let nClient = client.copy()
    if(_is_local_server(nClient, remote_url)){
        nClient.remote_auth( nClient.local_auth() )
    }
    else {
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
    }
    return nClient.fetch(remote_name)
}

export const removeRemote = async (remote_name, client, getTokenSilently) => { 
    let WOQL = TerminusClient.WOQL
    let using = client.organization() + "/" + client.db() + "/_meta"
    let q = WOQL.lib().delete_remote(using, remote_name)       
    return client.query(q, `Deleting remote ${remote_name}`)
}


export const Fetch = async (remote_name, client, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    client.remote_auth(creds)
    return client.fetch(remote_name)
}


export const UpdateOrganization = async (meta, remoteClient, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    return remoteClient.updateOrganization(meta.id, meta)    
}


export const RefreshDatabaseRecord = async (meta, remoteClient, getTokenSilently) => {  
    const jwtoken = await getTokenSilently()
    let creds = {type: "jwt", key: jwtoken}
    remoteClient.local_auth(creds)
    remoteClient.organization(meta.organization)
    remoteClient.db(meta.id)
    return remoteClient.getDatabase(meta.id, meta.organization)    
}



/*
* meta has : local_branch / remote_branch / url / commit 
*/
export const Push = async (local_branch, remote, remote_branch, remote_url, commit, client, getTokenSilently) => {  
    let from_branch = local_branch || 'main'
    let to_branch = remote_branch || 'main'
    commit = commit || `Push of local branch ${local_branch} to ${remote} branch ${remote_branch} with Console`
    let push_to = {
        remote: remote,
        remote_branch: to_branch,
        message: commit,
    }
    let nClient = client.copy()
    nClient.checkout(from_branch)
    if(_is_local_server(client, remote_url)){
        nClient.remote_auth( nClient.local_auth() )
    }
    else {
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
    }
    return nClient.push(push_to)
}

/*
* meta has : local_branch / remote_branch / url / commit 
*/
export const Pull = async (local_branch, remote, remote_branch, remote_url, commit, client, getTokenSilently) => {  
    let to_branch = local_branch || 'main'
    let from_branch = remote_branch || 'main'
    commit = commit || `Pull to local branch ${local_branch} from ${remote} branch ${remote_branch} with Console`
    let pull_from = {
        remote: remote,
        remote_branch: from_branch,
        message: commit,
    }
    let nClient = client.copy()
    nClient.checkout(to_branch)
    //create copy so we don't change internal state of woqlClient inadvertently
    if(_is_local_server(client, remote_url)){
        nClient.remote_auth(nClient.local_auth())
    }
    else {
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
    }
    return nClient.pull(pull_from)
}

export const legalURLID = (idstr) => {
    if(!idstr.match(/^[0-9a-z_]+$/)) {
        return false            
    }
    if(idstr.length > 40) return false
    return true
}

function _new_local_id(starter, dbl){
    let ind = 0;
    if(starter.lastIndexOf("_") != -1){
        let parts = starter.split("_")
        let v = parts[parts.length-1]
        if(_is_integer(v)){
            ind = v
            starter = starter.substring(0, starter.lastIndexOf("_"))
        }    
    }    
    let base = starter
    let ids = dbl.map((item) => item.id)
    while(ids.indexOf(base) != -1){
        base = starter + "_" + (++ind)
    }
    return base
}

function _new_remote_id(starter, org, dbl, preformed){
    let ind = 0;
    if(!preformed && starter.lastIndexOf("_") != -1){
        let parts = starter.split("_")
        let v = parts[parts.length-1]
        if(_is_integer(v)){
            ind = v
            starter = starter.substring(0, starter.lastIndexOf("_"))
        }    
    }
    let base = starter
    let ids = dbl.map((item) => item.organization + "/" + item.id)
    while(ids.indexOf(org + "/" + base) != -1){
        base = starter + "_" + (++ind)
    }
    return base
}

function _is_integer(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

function _is_local_server(client, url){
    return (client.server() == url.substring(0, client.server().length))
}


function _new_local_label(starter, dbl){
    let ind = 0;
    if(starter.lastIndexOf(" (") != -1 && starter.lastIndexOf(")") == (starter.length-1) ){
        let num = starter.substring(starter.lastIndexOf(" (") + 1, starter.lastIndexOf(")"))
        if(_is_integer(num)){
            ind = num
            starter = start.substring(0, starter.lastIndexOf(" (") - 1)
        }    
    }
    let ndbl = []
    for(var i = 0 ; i<dbl.length; i++){
        if(dbl[i].id) ndbl.push(dbl)
    }
    let base = starter
    let labs = ndbl.map((item) => item.label)
    while(labs.indexOf(base) != -1){
        base = starter + " (" + (++ind) + ")"
    }
    return base
}

