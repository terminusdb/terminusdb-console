import React, {useState, useEffect} from 'react'
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
import { TERMINUS_WARNING } from '../../constants/identifiers'

export const Collaborators = ({}) => {

    const {woqlClient, remoteClient, bffClient, refreshDBRecord } = WOQLClientObj()
    if(!bffClient) return null
    let user = woqlClient.user()
    const { getTokenSilently } = useAuth0()
    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [orgFilter, setOrgFilter] = useState("")
    const [dbFilter, setDBFilter] = useState("")
    const [collabAction, setCollabAction] = useState("my")
    const allDBs = bffClient.databases()
    if(allDBs.length == 0) return null
    const [dbs, setDBList] = useState(allDBs)
    const [subscreen, setSubscreen] = useState("my")
    const [incoming, setIncoming] = useState()
    const [outgoing, setOutgoing] = useState()


    function createOrg(doc) {
        doc.status = "active"
        doc.create = true    
        //doc.user_name = "admin"
        //woqlClient.createOrganization(doc.organization_name, doc)    
        UpdateOrganization(doc, bffClient, getTokenSilently)
        .then((bla) => {
            alert(JSON.stringify(bla))
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))            
    }
    
    function callOrgFilter(f){
        setOrgFilter(f.value)
    }

    function callDBFilter(f){
        setDBFilter(f.value)
    }


    useEffect(() => {
        let ndbs = []
        let inc = []
        let outg = []
        for(var i = 0; i<allDBs.length; i++){
            if(!orgFilter || (orgFilter == allDBs[i].organization)){
                ndbs.push(allDBs[i])                
                if(!dbFilter || (dbFilter == allDBs[i].organization + "/" + allDBs[i].id) && !isMyDB(allDBs[i])) {
                    outg.push(allDBs[i])    
                }
            }   
        }
        setOutgoing(outg)
        setDBList(ndbs)
        let collabs = bffClient.connection.user.collaborators
        if(collabs && collabs.length){
            for(var i = 0; i<collabs.length; i++){
                if(!dbFilter || (dbFilter == collabs[i].organization + "/" + collabs[i].id)) {
                    inc.push(collabs[i])    
                }
            }
            setIncoming(inc)
        }
    }, [orgFilter, dbFilter])

    function callActionSelect(f){
        setSubscreen(f.value)
    }

    return (<>
        <span className="database-list-intro">
            <TerminusDBSpeaks report={report} />
        </span>
        <Container>
            <Row>
                <Col></Col>
                <Col>
                {subscreen != "add" && 
                    <OrganizationFilter dblist={allDBs} filter={orgFilter} onChange={callOrgFilter} />
                }
                </Col>
                <Col>
                {subscreen != "add" && 
                    <DatabaseFilter dblist={dbs} orgFilter={orgFilter} filter={dbFilter} onChange={callDBFilter} />
                }
                </Col>
                <Col>
                    <CollaborateAction dblist={dbs} filter={collabAction} orgFilter={orgFilter} dbFilter={dbFilter} onChange={callActionSelect} />
                </Col>
            </Row>
            <Row>
                <Col>
                {subscreen == "my" && incoming && 
                    <MyCollaborators dblist={dbs} collaborators={incoming} user={user} />
                }
                {subscreen == "others" && outgoing &&
                    <MyCollaborations collaborators={outgoing}  user={user}/>
                }
                {(subscreen == "add" && dbs && dbs.length) && 
                    <AddCollaborators db={dbFilter} organization={orgFilter} dblist={dbs} />
                }
                {subscreen == "add_organization" && 
                    <Organization onUpdate={createOrg} />
                }
                </Col>
            </Row>
            </Container>
    </>)
}

//organization -> database -> action (my roles)

export const MyCollaborators = ({collaborators, user, dblist}) => {
    function getDBRec(id, org){
        for(var i = 0; i<dblist.length; i++){
            if(dblist[i].id == id && dblist[i].organization == org){
                return dblist[i]
            }
        }
        return false
    }

    let entries = []
    for(var i = 0; i < collaborators.length; i++){
        let entry = {}
        let dbrec = getDBRec(collaborators[i].id, collaborators[i].organization)
        entry.database = (dbrec ? dbrec.label : collaborators[i].id) 
        entry.id = collaborators[i].id
        entry.sharing = (dbrec && dbrec.public ? "Public" : "Private")
        entry.organization = dbrec ? dbrec.organization_label : entry.id
        entry.user = (collaborators[i].uid) ? collaborators[i].uid : collaborators[i].email 
        entry.role = getDBRole(collaborators[i])
        if(collaborators[i].type == "invitation"){
            entry.role += " (invited)"
        }
        entries.push(entry)
    }
    if(entries.length > 0)
        return (<CollaboratorList users={entries} />)
        return (
            <span className="database-list-intro">
                <TerminusDBSpeaks report={{status: TERMINUS_WARNING, "message": "No collaborators have been added to your databases"}} />
            </span>
        )
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
    if(db.organization_roles && db.organization_roles.indexOf('create') != -1 || db.organization_roles.indexOf('manage') != -1){
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