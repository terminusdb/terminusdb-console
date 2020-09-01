import React, {useState, useEffect} from "react";
import { CloneDB } from '../../components/Query/CollaborateAPI'
import {DBList} from './DBList'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {useAuth0} from '../../react-auth0-spa'
import {goDBPage, goDBHome, goHubPage} from "../../components/Router/ConsoleRouter"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { TERMINUS_INFO, TERMINUS_SUCCESS, TERMINUS_COMPONENT } from "../../constants/identifiers";
import { LIST_LOCAL, LIST_REMOTE } from "../Pages/constants.pages"
import Select from "react-select";
import Loading from "../../components/Reports/Loading"


export const DBListControl = ({list, className, user, type, sort, filter, count}) => {
    if(!list || !user ) return null
    const { woqlClient,  refreshDBRecord } = WOQLClientObj()
    const { getTokenSilently } = useAuth0()    
    const [listSort, setSort] = useState(sort || "name")
    const [listFilter, setFilter] = useState(filter || "")
    const [sorted, setSorted] = useState()
    const [loading, setLoading] = useState()

    useEffect(() => {
        if(listSort){
            let filt = _filter_list(list, listFilter)
            setSorted(_sort_list(filt, listSort))
        }
    }, [listSort, listFilter])

    useEffect(() => {
        let filt = _filter_list(list, listFilter)
        if(listSort){
            setSorted(_sort_list(filt, listSort))
        }
        else {
            setSorted(list)
        }
    }, [list])


    let message = user.logged_in ?  LIST_REMOTE : LIST_LOCAL 
    let [report, setReport] = useState({status: TERMINUS_INFO,  message: message})
    
    function setAction(dbmeta){
        let db = _copy_db_card(dbmeta)
        if(db.action == 'synchronise' || db.action == 'share'){
            goDBPage(db.id, woqlClient.user_organization(), "synchronize")
        }
        else if(db.action == 'hub' && db.remote_record){
            goHubPage(db.remote_record.organization, db.remote_record.id)            
        }
        else if(db.action == 'clone'){
            setLoading(true)
            CloneDB(db, woqlClient, getTokenSilently)
            .then((id) => {
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Cloned Database"})
                refreshDBRecord(id, woqlClient.user_organization(), 'clone', db.remote_record)
                .then(() => goDBHome(id, woqlClient.user_organization(), report)) 
            })
            .finally(() => setLoading(false))
        }
    }

    function callSort(nsort){
        setSort(nsort.value)
    }

    function callFilter(nfilt){
        setFilter(nfilt.value)
    }

    if(!sorted) return null
    if(loading) return (<Loading type={TERMINUS_COMPONENT}/>)
    return (<>
        <span className="database-list-intro">
            <TerminusDBSpeaks report={report} />
        </span>
        <span className="dblist-filters">
            <ListFilter filter={listFilter} logged_in={user.logged_in} onChange={callFilter} />
            <ListSorter sort={listSort} logged_in={user.logged_in} onChange={callSort} />
        </span>
        <DBList list={sorted} className={className} user={user} onAction={setAction}/>            
    </>)
}

export const ListFilter = ({filter, onChange, logged_in}) => {
    if(!logged_in) return null
    let filters = [
        {value: "", label: "Show all"},
        {value: "remote", label: "Hub Databases"},
        {value: "public", label: "Public Databases"},
        {value: "private", label: "Private Databases"},
        {value: "local", label: "Local Databases"},
        {value: "missing", label: "Databases Only on Hub"},
        {value: "unsynched", label: "Need Synchronisation"},
    ]

    let ph = ""
    for(var i = 0; i<filters.length; i++){
        if(filters[i].value == filter) ph += filters[i].label
    }


    return (
        <Select 
            className="dblist-filter"
            options={filters}
            placeholder = {ph}
            defaultValue= {filter}
            onChange ={onChange}
        />)
}

export const ListSorter = ({sort, logged_in, onChange}) => {
    let local_sort_algos = [
        {value: "updated", label: "Most recent update"},
        {value: "oldest", label: "Least recent update"},
        {value: "created", label: "Database Creation Time"},
        {value: "name", label: "Database Name (A-Z)"},
      //  {value: "size", label: "Database Size"}
    ]

    let remote_sort_algos = [
        {value: "organization", label: "Publisher"},
        {value: "updated local", label: "Local Update Time"},
        {value: "updated remote", label: "Remote Update Time"},
    ]

    if(logged_in){
        var sorts = local_sort_algos.concat(remote_sort_algos)
    }
    else {
        var sorts = local_sort_algos
    }

    let ph = ""
    for(var i = 0; i<sorts.length; i++){
        if(sorts[i].value == sort) ph += sorts[i].label
    }

    return (
        <Select 
            className="dblist-filter"
            options={sorts}
            placeholder = {ph}
            defaultValue= {sort}
            onChange ={onChange}
        />)
}

function _filter_list(unfiltered, filter){
    let filtf
    if(filter == ""){
        filtf = function(){return true}
    }
    if(filter == "remote"){
        filtf = function(dbrec){
            if(dbrec.remote_record) return true
            return false
        }
    }
    if(filter == "local"){
        filtf = function(dbrec){
            if(dbrec.remote_record) return false
            return true
        }
    }
    if(filter == "missing"){
        filtf = function(dbrec){
            if(dbrec.id) return false
            return true
        }
    }
    if(filter == "unsynched"){
        filtf = function(dbrec){
            if(!dbrec.remote_record) return false
            if(dbrec.ahead || dbrec.behind || dbrec.structure_mismatch) return true
            return false
        }
    }
    if(filter == "recommended"){
        filtf = function(dbrec){
            if(!dbrec.remote_record) return false
            if(dbrec.invitation) return false
            return false
        }
    }
    if(filter == "invitations"){
        filtf = function(dbrec){
            if(!dbrec.remote_record) return false
            if(dbrec.invitation) return true
            return false
        }
    }
    if(filter == "public"){
        filtf = function(dbrec){
            if(dbrec.public) return true
            if(dbrec.remote_record && dbrec.remote_record.public) return true
            return false
        }
    }
    if(filter == "private"){
        filtf = function(dbrec){
            if(dbrec.remote_record && dbrec.remote_record.public) return false
            if(!dbrec.remote_record) return false
            if(dbrec.type == "local_clone") return false
            return true
        }
    }
    if(filtf){
        return unfiltered.filter(filtf)
    }
    else {
        return unfiltered
    }
}

function _sort_list(unsorted, listSort){
    let sortf
    if(listSort == 'updated'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0
            if(a.remote_record && a.remote_record.updated > lts) lts = a.remote_record.updated 
            if(b.remote_record && b.remote_record.updated > rts) rts = b.remote_record.updated 
            if(rts == lts){
                lts = a.updated || 0
                rts = b.updated || 0
            }
            return (rts - lts)
        }
    }
    else if(listSort == 'oldest'){
        sortf = function(a, b){
            var lts = a.updated || 0
            var rts = b.updated || 0
            if(a.remote_record && a.remote_record.updated > lts) lts = a.remote_record.updated 
            if(b.remote_record && b.remote_record.updated > rts) rts = b.remote_record.updated 
            return lts - rts
        }
    }
    else if(listSort == 'updated local'){
        sortf = function(a, b){
            var lts = (a.id ? (a.updated || 0) : 0)
            var rts = (b.id ? (b.updated || 0) : 0)
            return rts - lts 
        }
    }
    else if(listSort == 'updated remote'){
        sortf = function(a, b){
            if(a.remote_record && b.remote_record){
                var lts = a.remote_record.updated || 0                
                var rts = b.remote_record.updated || 0                
                return rts - lts
            }
        }
    }
    else if(listSort == 'created'){
        sortf = function(a, b){
            var lts = a.created || 0
            var rts = b.created || 0
            return rts - lts
        }
    }
    else if(listSort == 'size'){
        sortf = function(a, b){
            var lts = a.size || 0
            var rts = b.size || 0
            return rts - lts
        }
    }
    else if(listSort == 'organization'){
        sortf = function(a, b){
            if(a.remote_record && b.remote_record){
                if(a.remote_record.organization && b.remote_record.organization){
                    if(a.remote_record.organization.toLowerCase() < a.remote_record.organization.toLowerCase()) { return -1; }
                    if(a.remote_record.organization.toLowerCase() > b.remote_record.organization.toLowerCase()) { return 1; }
                    return 0;    
                }
                if(a.remote_record.organization) return 1
                if(a.remote_record.organization) return -1
                return 1
            }

        }
    }
    else if(listSort == 'name'){
        sortf = function(a, b){
            if(a.label && b.label){
                if(a.label.toLowerCase() < b.label.toLowerCase()) { return -1; }
                if(a.label.toLowerCase() > b.label.toLowerCase()) { return 1; }
                return 0;
            }
        }
    }
    if(sortf){
        return unsorted.sort(sortf)
    }
    else {
        return unsorted
    }
}

function _copy_db_card(card){
    let ncard = {}
    for(var k in card){
        if(Array.isArray(card[k])){
            ncard[k] = []
            for(var i = 0; i<card[k].length; i++){
                if(typeof card[k][i] == "object"){
                    ncard[k].push(_copy_db_card(card[k][i]))   
                }
                else {
                    ncard[k].push(card[k][i])
                }                
            }
        }
        else if(typeof card[k] == "object"){
            ncard[k] = _copy_db_card(card[k])   
        }
        else {
            ncard[k] = card[k]
        }
    }
    return ncard
}
