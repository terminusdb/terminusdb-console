import React from 'react'
import { isHubURL, isLocalURL } from '../../components/Query/CollaborateAPI'
import {DBRemote} from "./DBRemote"

export const DBRemotes = ({woqlClient, meta, user, repos, branch, onDelete, onGoHub, onRefresh, onLogin, isHubURL, getTokenSilently, branchesUpdated, bffClient}) => {
    if(!meta || !repos) return null;
    let remotes = []
    
    function _repo_categorize(url){
        if(isHubURL(url)) return "hub"
        else if(isLocalURL(url, woqlClient)) return "local"
        else return "remote"
    }

    for(var rem in repos){
        if(rem != "local"){
            let rmeta = repos[rem]
            rmeta.type = _repo_categorize(rmeta.url)
            remotes.push(
                <div 
                    key={"abc_" + remotes.length} 
                    className="dbremote-full-card"
                >
                    <DBRemote
                        repo={rmeta} 
                        user={user}
                        meta={meta} 
                        branch={branch} 
                        onGoHub={onGoHub}
                        onDelete={onDelete}
                        onRefresh={onRefresh}
                        onLogin={onLogin}
                        bffClient={bffClient}
                        woqlClient={woqlClient}
                        getTokenSilently={getTokenSilently} 
                        branchesUpdated={branchesUpdated}
                    />
                </div>
            )
        }
    }
    return remotes    
}
