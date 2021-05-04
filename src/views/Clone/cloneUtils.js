//the database that the user owned
export const getUserHubDB = (woqlClient, user) =>{
    let dblist = woqlClient.databases()
    let mine = {}
    for(var i = 0; i<dblist.length; i++){
        if(dblist[i].remote_record && dblist[i].remote_record.organization == user.logged_in){
            if(typeof mine[dblist[i].remote_record.id] == "undefined"){
                mine[dblist[i].remote_record.id] = dblist[i].remote_record
            }
        }
    }
    return Object.values(mine)
}
//the database that the user collaborate with
export const getUserCollDB = (woqlClient, user) =>{
    let dblist = woqlClient.databases()
    let cds = {}
    for(var i = 0; i<dblist.length; i++){
        if(dblist[i].remote_record && dblist[i].remote_record.organization != user.logged_in && dblist[i].remote_record.roles && dblist[i].remote_record.roles.length){
            if(typeof cds[dblist[i].remote_record.organization + "/" + dblist[i].remote_record.id] == "undefined"){
                cds[dblist[i].remote_record.organization + "/" + dblist[i].remote_record.id] = dblist[i].remote_record
            }
        }
    }
    return Object.values(cds)
}

export const _filter_list = (unfiltered, filter)=>{
    if(!unfiltered.length) return []
    let filtf
    if(filter == ""){
        filtf = function(){return true}
    }
    if(filter == "hub"){
        filtf = function(dbrec){
            if(dbrec.local_copies) return false
            return true
        }
    }
    if(filter == "local"){
        filtf = function(dbrec){
            if(dbrec.local_copies) return true
            return true
        }
    }
    if(filter == "rejected"){
        filtf = function(dbrec){
            if(dbrec.id) return false
            return true
        }
    }
    if(filter == "unsynched"){
        filtf = function(dbrec){
            if(dbrec.ahead || dbrec.behind || dbrec.structure_mismatch) return true
            return false
        }
    }
    if(filter == "accepted"){
        filtf = function(dbrec){
            if(dbrec.invitation) return true
            return false
        }
    }
    if(filter == "private"){
        filtf = function(dbrec){
            if(dbrec.public) return false
            return false
        }
    }
    if(filter == "public"){
        filtf = function(dbrec){
            if(dbrec.public) return true
            return false
        }
    }
    if(filtf){
        return unfiltered.filter(filtf)
    }
    else {
        return unfiltered
    }
}

function _sort_str(a, b){
    if(a && b){
        if(a.toLowerCase() < b.toLowerCase()) { return -1; }
        if(a.toLowerCase() > b.toLowerCase()) { return 1; }
    }
    if(a) return 1
    if(b) return -1
    return 0;
}

export const _sort_list = (unsorted, listSort) =>{
    if(!unsorted.length) return []
    let sortf
    if(listSort == 'updated'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0
            return (rts - lts)
        }
    }
    else if(listSort == 'oldest'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0
            return lts - rts
        }
    }
    else if(listSort == 'created'){
        sortf = function(a, b){
            var lts = a.created || 0
            var rts = b.created || 0
            return rts - lts
        }
    }
    else if(listSort == 'organization'){
        sortf = function(a, b){
            return b.organization - b.organization
        }
    }
    else if(listSort == 'name'){
        sortf = function(a, b){
            return _sort_str(a.label, b.label)
        }
    }
    if(sortf){
        return unsorted.sort(sortf)
    }
    else {
        return unsorted
    }
}

export const _get_pp_stats = (list) =>{
    let s = {
        total: list.length,
        public: 0,
        private: 0
    }
    for(var i = 0; i<list.length; i++){
        if(list[i].public) s.public++
        else s.private++
    }
    return s
}
