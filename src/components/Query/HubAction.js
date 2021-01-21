export const RecordHubAction = (bff, action, url, branch) => {
    if(bff && bff.action){
        return bff.action(action, formRecord("success", url, branch))
    }
}

export const RecordHubFailure = (bff, action, url, branch) => {
    if(bff && bff.action){
        return bff.action(action, formRecord("failure", url, branch))
    }
    //console.log(bff)
}

function formRecord(s, u, b){
    let action = {
        status: s,
        database: u,
    }
    if(b){
        action.branch = b
    }
    return action
}