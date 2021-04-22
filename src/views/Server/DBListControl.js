import React, {useState, useEffect,useReducer} from "react";
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
import {CreateLocalForm} from "../CreateDB/CreateDatabase"
import {BsPlus} from "react-icons/bs"
import { GRAPHDB, HUBDB } from "../../constants/images"
import { MdContentCopy } from 'react-icons/md';

export const DBListControl = ({list, className, user, type, sort, filter, count}) => {

    //console.log("___DB___LIST", list)
    if(!list || !user ) return null
    const { woqlClient,  refreshDBRecord, bffClient } = WOQLClientObj()
    const { getTokenSilently } = useAuth0()
    const [listSort, setSort] = useState(sort || "name")
    const [listFilter, setFilter] = useState(filter || "")
    const [sorted, setSorted] = useState([])
    const [loading, setLoading] = useState()
    const [showingCreate, setShowingCreate] = useState(false)
    let [report, setReport] = useState()

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
            CloneDB(db, woqlClient, getTokenSilently, false, false, bffClient)
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

    function showCreate(){
        setShowingCreate(true)
    }

    function unshowCreate(){
        setShowingCreate(false)
    }

    //we don't reduce the number of database we only sort it 
    //so the sorted  lenght is the same of the list length

    let initialState = {
        total: list.length,
        showing: sorted.length,
        remotes: 0,
        dbInfo:0,
        
    }

    //to be architect better this is a test 
    // I can add an update in the init context maybe
    const [stats, updateDBListInfo] = useReducer(generateListStats, initialState);

    function generateListStats(stats){
        const statsNew = {
            total: list.length,
            showing: sorted.length,
            remotes: 0,
            
        }
        for(var i = 0; i<sorted.length; i++){
            if(sorted[i].remote_url) statsNew.remotes++
        }
        return statsNew
    }

    //if(!sorted) return null
    if(loading) return (<Loading type={TERMINUS_COMPONENT}/>)
    if(showingCreate) return (<CreateLocalForm onCancel={unshowCreate}/>)

    return (<>
        <div className="dblist-filters">
            <div className="home_top_bar">
            <DBListStats type={type} stats={stats} filter={listFilter}/>
            <CreateDB type={type} onCreate={showCreate} />
            </div>
            <div className="home_top_bar justify-content-end">
                <ListFilter type={type} filter={listFilter} logged_in={user.logged_in} onChange={callFilter} />
                <ListSorter type={type} sort={listSort} logged_in={user.logged_in} onChange={callSort} />
            </div>
        </div>
        <div className="generic-message-holder">
            {report &&
                <TerminusDBSpeaks report={report} />
            }
        </div>
        <DBList updateRemote={initialState} update={updateDBListInfo} type={type} list={sorted} className={className} user={user} onAction={setAction}/>
    </>)
}
//
//to be review the element hierarchy
export const DBListStats = ({type, stats, filter}) => {
    let txt
    if(stats.total == 0){
        txt = "There are no databases on this TerminusDB server"
    }
    else if(filter){
        txt = "Showing " + stats.showing + " of " + stats.total + " local database" + (stats.total != 1 ? "s" : "")
    }
    else {
        txt = stats.total + " local databases"
    }
    return (
        <span className="stats-list">
            <img src={GRAPHDB} className="stats-icon" /> {txt}
            {(stats.remotes > 0) &&
                <DBRemoteCount count={stats.remotes} />
            }
        </span>
    )
}


export const DBRemoteCount = ({count}) => {
    let txt = (count == 1 ? "1 Clone" : "" + count + " Clones" )
    return (
        <span className="db-card-credit">
            <span className="db_info">
                {txt} <MdContentCopy />
            </span>
        </span>
    )
}

export const CreateDB = ({type, onCreate, title}) => {
    let txt = "Create " + (title ? title : "Database")
    let ntitle = "Create a new " + title + (type == "clone" ? " on TerminusHub" : "")
    return (
        <button title={ntitle} type="submit" className="dblist-create" onClick={onCreate}>
            {txt} <BsPlus className="create-btn-icon"/>
        </button>
    )
}


export const ListFilter = ({filter, type, onChange, logged_in}) => {
    if(!logged_in) return null
    let filters = [
        {value: "", label: "Show all"},
        {value: "remote", label: "Hub Databases"},
        {value: "public", label: "Public Databases"},
        {value: "private", label: "Private Databases"},
        {value: "local", label: "Local Databases"},
        {value: "unsynched", label: "Need Synchronisation"},
    ]
    if(type == "clone"){
        filters.push({value: "missing", label: "Databases Only on Hub"})
    }

    let ph = ""
    for(var i = 0; i<filters.length; i++){
        if(filters[i].value == filter) ph += filters[i].label
    }


    return (
        <Select
            className="dblist-filter mb-2"
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
        {value: "size", label: "Database Size"}
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
            placeholder = {"Order by " + ph}
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
