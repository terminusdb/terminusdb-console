import React, {useState, useEffect, Fragment} from 'react'
import {Row, Col, Container} from 'reactstrap'
import Loading from '../../components/Reports/Loading'
import { WOQLClientObj } from '../../init/woql-client-instance'
import { Organization } from './Organization'
import { TerminusDBSpeaks } from '../../components/Reports/TerminusDBSpeaks'
import { UpdateOrganization } from '../../components/Query/CollaborateAPI'
import { useAuth0 } from '../../react-auth0-spa'
import Select from "react-select";
import { CollaboratorList } from '../Tables/CollaboratorList'
import { AddCollaborators } from './AddCollaborators'
import { TERMINUS_WARNING, TERMINUS_ERROR, TERMINUS_COMPONENT } from '../../constants/identifiers'
import { AiOutlinePlus, AiOutlineCloseCircle } from "react-icons/ai";
import { GRAPHDB, HUBDB } from "../../constants/images"
import { MdContentCopy } from 'react-icons/md';
import {FiUsers} from "react-icons/fi"
import {PAYMENT_ROUTE} from "../../constants/routes"

export const Collaborators = ({list, dbs, onComplete}) => {
    if(!Array.isArray(list)) return null

    const {woqlClient, remoteClient, bffClient, refreshDBRecord } = WOQLClientObj()
    if(!bffClient) return null
    
    const [adding, setAdding] = useState(false)

    function showCreate(){
        setAdding(true)
    }

    function unShowCreate(){
        setAdding(false)
    }



    if(adding) {
        return <AddCollaborator onComplete={onComplete} uname={woqlClient.user().logged_in} collaborators={list} dbs={dbs} onCancel={unShowCreate}/>
    }

    return (<Fragment>
            <div className="dbclone-filters">
                <CollaboratorListStats uname={woqlClient.user().logged_in} collaborators={list} dbs={dbs} />
                <CreateCollaboraor type="clone" onCreate={showCreate} />
            </div>
        
            <Row>
                <MyCollaborators collaborators={list} user={woqlClient.user()} />
            </Row>
    </Fragment>)
}

export const AddCollaborator = ({onCancel, onComplete, uname, collaborators, dbs}) => {
    let [report, setReport] = useState()
    let [loading, setLoading] = useState(false)
    let [db, setDB] = useState()
    let [perm, setPerm] = useState()
    let [ctype, setCtype] = useState()
    let [cid, setCID] = useState()
    const {bffClient} = WOQLClientObj()
    
    let [stage, setStage] = useState()
    let [ulist, setUlist] = useState()

    useEffect(() => {
        let xlist = []
        for(var i = 0; i<collaborators.length; i++){
            let c = collaborators[i]
            if(c.uid){
                let p = c.uid
                if(xlist.indexOf(p) == -1 && p != uname) xlist.push(p)
            }
        }
        if(!xlist.length){
            setCtype("new")
        }
        setUlist(xlist)
    }, 
    [])

    if(!Array.isArray(ulist)) return null

    function chooseDB(e){
        setReport()
        setDB(e.value)
    }

    function choosePerm(e){
        setReport()
        setPerm(e.value)
    }

    function chooseCtype(e){
        setReport()
        setCtype(e.value)
    }

    function chooseCID(e){
        setReport()
        setCID(e)
    }


    let showGo = (db && perm && ctype && cid)

    async function enactSubmission(invite){
        setReport()
        let doc = {agent_names: [cid], database_name: db, organization_name: uname, actions: [perm], invite: invite}
        setLoading(true)
        bffClient.updateRoles(doc)
        .then((res) => {
            onComplete()
        })
        .catch((e) => {
            setReport({status: TERMINUS_ERROR, message: "Failed to add collaborator", error: e })
        })
        .finally(() => setLoading(false))
    }


    async function checkSubmission(){
        setReport()
        let doc = {agent_names: [cid], database_name: db, organization_name: uname, actions: [perm], test: true}
        setLoading(true)
        bffClient.updateRoles(doc)
        .then((res) => {
            if(res.status == "error"){
                setReport({status: TERMINUS_ERROR, message: res.message})
            }
            else if(res.status == "upgrade"){
                setReport({status: TERMINUS_WARNING, message: "You have reached the limit of collaborators on your current plan"})
                setStage(res.status)
            }
            else {
                setStage(res.status)
            }
        })
        .catch((e) => {
            setReport({status: TERMINUS_ERROR, message: "Failed to add collaborator", error: e })
        })
        .finally(() => setLoading(false))
    }
    return (
        <div className="pretty-form">
            <div className="create-place-badge remote-badge">
                <AiOutlineCloseCircle className="cancel-create-form" title="Cancel Add Collaborator" onClick={onCancel}/>
                Adding a Collaborator
            </div>
            <Row className="generic-message-holder">
                {report &&
                    <TerminusDBSpeaks report={report} />
                }
            </Row>
            {!stage && 
                <Row>
                    <Col><ChooseDatabase dbs={dbs} onChoose={chooseDB} /></Col>
                    <Col><ChoosePermission onChoose={choosePerm} /></Col>
                    {(ulist.length > 0 ) && 
                        <Col><ChooseCollaboratorType list={ulist} onChoose={chooseCtype} /></Col>
                    }
                    <Col><ChooseCollaborator list={ulist} type={ctype} onChoose={chooseCID} /></Col>
                    <Col>
                        {showGo && 
                        <button type="submit" onClick={checkSubmission} className="mt-1 tdb__button__base tdb__button__base--green">
                            Add Collaborator
                        </button>
                        }
                    </Col>
                </Row>
            }
            {stage == "upgrade" && 
                <UpgradeToPro />
            }
            {stage == "invite" && 
                <ConfirmAddition onSubmit={enactSubmission} type="invite" role={perm} user={cid} db={db} org={uname} />
            }
            {stage == "ok" && 
                <ConfirmAddition onSubmit={enactSubmission} type="add" role={perm} user={cid} db={db} org={uname} />
            }
            {loading &&  <Loading type={TERMINUS_COMPONENT} />}
        </div>
    )
}

export const UpgradeToPro = ({}) => {
    return <div className='upgrade-button-holder'> 
        <a target="_blank" href={PAYMENT_ROUTE} className="mt-1 tdb__button__base tdb__button__base--green">
        Upgrade To Pro
    </a></div>
}


export const ConfirmAddition = ({type, role, user, db, org, onSubmit}) => {
    let [inv, setInv] = useState("")

    function updateInvitation(e){
        setInv(e.target.value)
    }

    function submitInvitation(){
        onSubmit(inv)
    }

    let btxt = (type == "invite" ? "Send Invitation Email" : "Confirm New Collaborator")
    return <Fragment>
        <Row className="role-grant-details">
            Granting {role} to {user} for database {org}/{db}
            {type == "invite" &&
                <span className="invite-expl"> {user} does not have an account - send an invitation email?</span> 
            }
            {type != "invite" && 
                <span className="invite-expl"> Attach an explanatory note?</span> 
            }
        </Row>
        <Row>
            <textarea 
                className='invite-body' 
                placeholder="Enter an invitational note to send to the collaborator"
                onChange={updateInvitation}
            />
        </Row>
        <div className='upgrade-button-holder'> 
            <button onClick={submitInvitation} className="mt-1 tdb__button__base tdb__button__base--green">
                {btxt}
            </button>
        </div>
    </Fragment>
}


export const ChooseDatabase = ({dbs, onChoose}) => {
    let options = dbs.map((item) => {
        return {value: item.id, label: item.label || item.id}
    })
    let ph = "Choose Database"
    return (
        <Select
            options={options}
            placeholder = {ph}
            defaultValue= ""
            onChange={onChoose}
        />
    )
}


export const ChooseCollaboratorType = ({collaborators, onChoose}) => {
    let options = [
        {value: "existing", label: "Existing Collaborator"},
        {value: "new", label: "New Collaborator"},
    ]
    let ph = "New or existing collaborator"
    return (
        <Select
            options={options}
            placeholder = {ph}
            defaultValue= ""
            onChange={onChoose}
        />
    )
}

export const ChooseCollaborator = ({list, type, onChoose}) => {
    if(!type) return null

    function selectCollaborator(e){
        onChoose(e.value)
    }

    function inputCollaborator(e){
        onChoose(e.target.value)
    }

    if(type == "new"){
        return <input type='text' placeholder="publisher ID or email address" className='collab-input' onChange={inputCollaborator} />
    }
    else {
        let options = list.map((item) => {
            return {value: item, label: item}
        })        
        let ph = "Choose collaborator"
        return (
            <Select
                options={options}
                placeholder = {ph}
                defaultValue= ""
                onChange={selectCollaborator}
            />
        )
    }
}



export const ChoosePermission = ({onChoose}) => {
    let options = [
        {value: "read", label: "Read Only (Pull, Clone)"},
        {value: "write", label: "Contributor (Pull, Push)"},
    ]
    let ph = "Choose the role to grant"
    return (
        <Select
            options={options}
            placeholder = {ph}
            defaultValue= ""
            onChange={onChoose}
        />
    )
}

function isPrivate(id, org, dbs){
    for(var i = 0; i<dbs.length; i++){
        if(dbs[i].organization == org && dbs[i].id == id){
            return !dbs[i].public
        }
    }
    return false
}

function isPrivateCollaborator(cid, collaborators, dbs){
    for(var j = 0; j<collaborators.length; j++){
        if(collaborators[j].uid == cid || collaborators[j].email == cid){
            if(isPrivate(collaborators[j].id, collaborators[j].organization, dbs)) return true
        }
    }
    return false
}



function _cstats(collaborators, dbs, uname){
    let ulist = []
    for(var i = 0; i<collaborators.length; i++){
        let c = collaborators[i]
        if(c.uid){
            let p = c.uid
            if(ulist.indexOf(p) == -1 && p != uname) ulist.push(p)
        }
        else if(c.email){
            ulist.push(email)
        }
    }

    let stats = {
        total: ulist.length,
        private: 0
    }


    for(var i = 0; i<ulist.length; i++){
        let priv = isPrivateCollaborator(ulist[i], collaborators, dbs)
        if(priv) stats.private++ 
    }
    return stats
}

export const CollaboratorListStats = ({uname, collaborators, dbs}) => {
    let stats = _cstats(collaborators, dbs, uname)
    return (
        <span className="stats-list-intro">
            <FiUsers className="collaborators-count hub-bar-spacing"/> {stats.total} Collaborators
            ({stats.private} Private)
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

export const CreateCollaboraor = ({type, onCreate, title}) => {
    let txt = "Add Collaborator"
    return ( 
        <button type="submit" className="dblist-create" onClick={onCreate}>
            {txt} <AiOutlinePlus className="create-btn-icon" />
        </button>
    )
}


//organization -> database -> action (my roles)

export const MyCollaborators = ({collaborators, user}) => {
    const {woqlClient, contextEnriched} = WOQLClientObj()

    if(!Array.isArray(collaborators)) return null

    let [dblist, setList] = useState(loadDBList())

    useEffect(() => {
        if(contextEnriched){
            setList(loadDBList())
        }
    }, [contextEnriched])

    function loadDBList(){
        let mdbs = {}
        let dbs = woqlClient.databases()
        for(var i = 0; i<dbs.length; i++){
            if(dbs[i].remote_record && dbs[i].remote_record.organization == user.logged_in){
                if(typeof mdbs[dbs[i].remote_record.id] == 'undefined'){
                    mdbs[dbs[i].remote_record.id] = dbs[i].remote_record
                }
            }
        }
        return Object.values(mdbs)
    }    

    function getEntries(){
        let entries = []
        for(var i = 0; i < collaborators.length; i++){
            let entry = {}
            entry["Database ID"] = collaborators[i].id
            let dbrec = getDBRec(collaborators[i].id, collaborators[i].organization)
            let pub = "?"
            if(dbrec){
                entry['Database Name'] = dbrec.label
                //entry.organization = dbrec.organization_label || collaborators[i].organization
                pub = dbrec.public ? "Public" : "Private"
            }
            else {
                entry['Database Name'] = entry["Database ID"]
                //entry.organization = collaborators[i].organization
            }
            entry.user = (collaborators[i].uid) ? collaborators[i].uid : collaborators[i].email 
            entry.role = getDBRole(collaborators[i])
            if(collaborators[i].type == "invitation"){
                entry.role += " (invited)"
            }
            entry.public = pub
            entries.push(entry)
        }
        return entries    
    }

    function getDBRec(id, org){
        for(var i = 0; i<dblist.length; i++){
            if(dblist[i].id == id && dblist[i].organization == org){
                return dblist[i]
            }
        }
        return false
    }

    let entries = getEntries()
    if(entries.length > 0)
        return (<span className='clist-holder'>
            <span className='clist-itself'>
                <CollaboratorList users={entries} />
            </span>
        </span>
    )
    else {
        return (
            <span className="database-list-intro">
                <TerminusDBSpeaks report={{status: TERMINUS_WARNING, "message": "No collaborators have been added to your databases"}} />
            </span>
        )
    }
}

export const MyCollaborations = ({collaborators, user}) => {
    let entries = []
    for(var i = 0; i < collaborators.length; i++){
        if(!isMyDB(collaborators[i])){
            let entry = {}
            entry.database = collaborators[i].label
            entry.id = collaborators[i].id
            entry.sharing = (collaborators[i].public ? "Public" : "Private")
            entry.organization = collaborators[i].organization_label
            entry["My Role"] = getDBRole(collaborators[i])
            entries.push(entry)
        }
    }
    if(entries.length > 0)
        return (<CollaboratorList users={entries} />)
    return (
        <span className="database-list-intro">
            <TerminusDBSpeaks report={{status: TERMINUS_WARNING, "message": "You have not been added as a collaborator on any databases"}} />
        </span>
    )
}


export const OrganizationFilter = ({filter, onChange, dblist}) => {
    let filters = {}
    for(var i = 0; i<dblist.length; i++){
        filters[dblist[i].organization] = {value: dblist[i].organization, label: dblist[i].organization_label}
    }
    let sfilters = [
        {value: "", label: "All Organizations"}
    ].concat(Object.values(filters))
    
    if(sfilters.length <= 2) return null

    return (
        <Select 
            options={sfilters}
            placeholder = "Filter by Organization"
            defaultValue= {filter}
            onChange ={onChange}
        />)
}

export const DatabaseFilter = ({filter, orgFilter, onChange, dblist}) => {
    let filters = {}
    let all_label = "All Databases"
    for(var i = 0; i<dblist.length; i++){
        if(!orgFilter || orgFilter == dblist[i].organization){
            let fullid = dblist[i].organization + "/" + dblist[i].id 
            filters[fullid] = {value: fullid, label: dblist[i].label}
            if(orgFilter && orgFilter == dblist[i].organization){
                all_label = "All " + (dblist[i].organization_label || dblist[i].organization) + " Databases"
            }
        }
    }

    let sfilters = [
        {value: "", label: all_label}
    ].concat(Object.values(filters))
    
    if(sfilters.length == 1) return null
    
    return (
        <Select 
            options={sfilters}
            placeholder = "Filter by Database"
            defaultValue= {filter}
            onChange ={onChange}
        />
    )
}

export const CollaborateAction = ({filter, orgFilter, dbFilter, onChange, dblist}) => {
    let collaborate_actions = [
        {value: "my", label: "Collaborators on my databases"},
        {value: "others", label: "My Collaborations with others"},
        {value: "add", label: "Add Collaborators"},
        //{value: "add_organization", label: "Add Organization"}
    ]

    return (
        <Select 
            options = {collaborate_actions}
            defaultValue = {filter}
            onChange = {onChange}
            placeholder = "Collaboration Actions"
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
            if(dbrec.recommended) return true
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
            var lts = a.updated || 0
            var rts = b.updated || 0
            return lts - rts 
        }
    }
    else if(listSort == 'updated remote'){
        sortf = function(a, b){
            if(a.remote_record && b.remote_record){
                var lts = b.remote_record.updated || 0                
                var rts = a.remote_record.updated || 0                
                return rts - lts
            }
        }
    }
    else if(listSort == 'created'){
        sortf = function(a, b){
            var lts = a.created || 0
            var rts = b.created || 0
            return lts - rts
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
                return b.remote_record.organization_label - b.remote_record.organization_label
            }
        }
    }
    if(sortf){
        return unsorted.sort(sortf)
    }
    else if(listSort == 'name'){
        return unsorted.sort(sortf)
    }
    else {
        return unsorted
    }
}


function isMyDB(db){
    if(db.organization_roles && (db.organization_roles.indexOf('create') != -1 || db.organization_roles.indexOf('manage') != -1)){
        return true;
    }
    if(db.roles && db.roles.indexOf('create') != -1 || db.roles.indexOf('manage') != -1) return true
    return false

}

function getDBRole(db){
    if(db.organization_roles && db.organization_roles.indexOf('create') != -1 || db.roles && db.roles.indexOf('create') != -1){
        return "Owner";
    }
    if(db.organization_roles && db.organization_roles.indexOf('manage') != -1 || db.roles && db.roles.indexOf('manage') != -1){
        return "Manager"
    }
    if(db.roles && db.roles.indexOf('write') != -1){
        return "Write"
    }
    if(db.actions && db.actions.indexOf("push") == -1){
        return "Write"
    }
    if(db.roles && db.roles.indexOf('read') != -1){
        return "Read"
    }
    if(db.actions && db.actions.indexOf("pull") == -1){
        return "Read"
    }
    return false

}