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
    const [subscreen, setSubscreen] = useState()


    function createOrg(doc) {
        //should really come from form
        let d = {
            organization_name: "xxx23",
        }
        return woqlClient.createOrganization("xxx23", d)
        /*doc.status = "active"
        doc.create = true
        UpdateOrganization(doc, bffClient, getTokenSilently)
        .then((bla) => {
            alert(JSON.stringify(bla))
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))*/            
    }
    
    function callOrgFilter(f){
        setOrgFilter(f.value)
    }

    function callDBFilter(f){
        setDBFilter(f.value)
    }

    useEffect(() => {
        let ndbs = []
        for(var i = 0; i<allDBs.length; i++){
            if(!orgFilter || (orgFilter == allDBs[i].organization)){
                ndbs.push(allDBs[i])
            }
        }
        setDBList(ndbs)
    }, [orgFilter])

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
                    <OrganizationFilter dblist={allDBs} filter={orgFilter} onChange={callOrgFilter} />
                </Col>
                <Col>
                    <DatabaseFilter dblist={dbs} orgFilter={orgFilter} filter={dbFilter} onChange={callDBFilter} />
                </Col>
                <Col>
                    <CollaborateAction dblist={dbs} filter={collabAction} orgFilter={orgFilter} dbFilter={dbFilter} onChange={callActionSelect} />
                </Col>
            </Row>
            <Row>
                {subscreen == "my" && 
                    <MyCollaborators />
                }
                {subscreen == "others" && 
                    <MyCollaborations />
                }
                {(subscreen == "add" && dbs && dbs.length) && 
                    <AddCollaborators db={dbFilter} organization={orgFilter} dblist={dbs} />
                }
                {subscreen == "add_organization" && 
                    <Organization onUpdate={createOrg} />
                }
            </Row>
        </Container>
    </>)
}

//organization -> database -> action (my roles)

export const MyCollaborators = () => {
    let collabs = [
        {database: "db1", organization: "abc", collaborator: "joe@smith.com", role: "read"},
        {database: "db2", organization: "abc", collaborator: "jill@smith.com", role: "write"}
    ]
    return (<CollaboratorList users={collabs} />)
}

export const MyCollaborations = () => {
    let mycollabs = [
        {database: "db1", organization: "abc", collaborator: "joe@smith.com", role: "read"},
        {database: "db2", organization: "abc", collaborator: "jill@smith.com", role: "write"}
    ]
    return (<CollaboratorList users={mycollabs} />)
}


export const OrganizationFilter = ({filter, onChange, dblist}) => {
    let filters = {}
    for(var i = 0; i<dblist.length; i++){
        filters[dblist[i].organization] = {value: dblist[i].organization, label: dblist[i].organization_label}
    }
    let sfilters = [
        {value: "", label: "All Organizations"}
    ].concat(Object.values(filters))
    
    if(sfilters.length == 1) return null

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
            placeholder = "Databases"
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
        {value: "add_organization", label: "Add Organization"}
    ]

    return (
        <Select 
            options = {collaborate_actions}
            defaultValue = {filter}
            onChange = {onChange}
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