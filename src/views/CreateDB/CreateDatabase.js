import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {
    TERMINUS_SUCCESS,
    TERMINUS_INFO,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import { CREATE_DB_FORM, SHARE_DB_FORM, CREATE_REMOTE_INTRO, CREATE_LOCAL_INTRO } from './constants.createdb'
import { goDBHome } from '../../components/Router/ConsoleRouter'
import { DBDetailsForm } from './DBDetails'
import {useAuth0} from '../../react-auth0-spa'
import { CreateLocal, CreateRemote, ShareLocal } from '../../components/Query/CollaborateAPI'
import { Row, Col } from "reactstrap"
import { TerminusDBSpeaks } from '../../components/Reports/TerminusDBSpeaks'
import {DBCreateHeader, DBLocalCreateHeader, DBCreateCard, DBShareHeader} from "./DBCreateCard"

export const CreateDatabase = ({from_local, type, onShare}) => {
    const [loading, setLoading] = useState(false)
    const {woqlClient, remoteClient, bffClient, refreshDBRecord } = WOQLClientObj()
    let user = woqlClient.user()
    const { getTokenSilently } = useAuth0();
    let update_start = Date.now()
    const [report, setReport] = useState()
    const [local, setLocal] = useState(true)

    let message = user.logged_in ?  CREATE_REMOTE_INTRO : CREATE_LOCAL_INTRO
    if(from_local) message = "Share your local databases on terminus hub"
    /**
     * Creates a database and, if a schema graph is set, creates the main schema graph
     * On success, it fires up the home page of the database and rebuilds the list of databases
     */
    function onCreate(doc) {
        update_start = Date.now()
        if(doc.sharing != "local"){
            if(!user.logged_in){
                setReport({status: TERMINUS_WARNING, message: "If you are not logged in to terminusHub, you can only create local databases"})
                return false;
            }
            else {
                if(doc.sharing == 'public' || doc.sharing == "") doc.public = true
                delete(doc['sharing'])
                setLoading(true)
                if(from_local) return shareLocal(doc, from_local, update_start)
                return createRemote(doc, update_start)
            }
        }
        setLoading(true)
        return createLocal(doc, update_start)
    }

    async function createLocal(doc, update_start){
        setLoading(true)
        update_start = update_start || Date.now()
        doc.organization = woqlClient.user_organization()
        return CreateLocal(doc, woqlClient)
        .then((local_id) => {
            after_create_db(update_start, get_remote_create_message(doc.label, doc.id), local_id, "create", doc)
        })
        .catch((err) => process_error(err, update_start, create_local_failure(doc.label, local_id)))
        .finally(() => setLoading(false))
    }

    async function shareLocal(doc, local, update_start) {
        setLoading(true)
        update_start = update_start || Date.now()
        if(!doc.organization) doc.organization = bffClient.user_organization()
        doc.remote_url = remoteClient.server() + doc.organization + "/" + doc.id
        let sclient = woqlClient.copy()
        if(local) {
            sclient.organization(local.organization)
            sclient.db(local.id)
        }
        let lid = sclient.db()
        ShareLocal(doc, sclient, bffClient, getTokenSilently)
        .then(() => {
            after_create_db(update_start, get_local_create_message(doc.label, doc.id), lid, "share", doc, onShare)
        })
        .catch((err) => process_error(err, update_start, clone_remote_failure(doc.label, lid)))
        .finally(() => setLoading(false))
    }


    async function createRemote(doc, update_start) {
        setLoading(true)
        if(!doc.organization) doc.organization = bffClient.user_organization()
        update_start = update_start || Date.now()
        doc.remote_url = remoteClient.server() + doc.organization + "/" + doc.id
        CreateRemote(doc, woqlClient, bffClient, getTokenSilently)
        .then((local_id) => {
            after_create_db(update_start, get_remote_create_message(doc.label, local_id), local_id, "clone", doc)
        })
        .catch((err) => process_error(err, update_start, clone_remote_failure(doc.label, doc.id)))
        .finally(() => setLoading(false))
    }

    function after_create_db(update_start, message, id, create_or_clone, remote_record, onShare){
        woqlClient.db(id)
        let rep = {
            status: TERMINUS_SUCCESS,
            message: message,
            time: Date.now() - update_start,
        }
        setReport(rep)
        if(create_or_clone == 'share'){
            if(onShare){
                onShare(remote_record)
            }
            else {
                return refreshDBRecord(id, woqlClient.user_organization(), create_or_clone, remote_record)
                .then(() => goDBHome(id, woqlClient.user_organization(), report))
            }
        }
        else {
            refreshDBRecord(id, woqlClient.user_organization(), create_or_clone, remote_record)
            .then(() => goDBHome(id, woqlClient.user_organization(), report))
        }
    }

    function get_local_create_message(label, id){
        return `${CREATE_DB_FORM.createSuccessMessage} ${label}, (id: ${id}) `
    }

    function get_remote_create_message(label, id){
        return `${CREATE_DB_FORM.createRemoteSuccessMessage} ${label}, (id: ${id}) `
    }

    function create_local_failure(label, id){
        return`${CREATE_DB_FORM.createFailureMessage} ${label}, (id: ${id}) `
    }

    function clone_remote_failure(label, id){
        return `${CREATE_DB_FORM.cloneRemoteFailureMessage} ${label}, (id: ${id}) `
    }

    function create_remote_failure(label, id){
        return `${CREATE_DB_FORM.createRemoteFailureMessage} ${label}, (id: ${id}) `
    }

    function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
    }

    function toggleLocal(){
        setLocal(!local)
    }

    if(type && type == "share"){
        return (
            <div className="tdb__loading__parent">
                {loading &&  <Loading type={TERMINUS_COMPONENT} />}
                <DBShareHeader />
                <Row className="generic-message-holder">
                    {report &&
                        <TerminusDBSpeaks report={report} />
                    }
                </Row>
                {
                    <DBShareForm starter={from_local} onSubmit={shareLocal} />
                }
            </div>
        )
    }


    let buttons = (from_local ? SHARE_DB_FORM.buttons : CREATE_DB_FORM.buttons)
    let allow_remote = (user.logged_in || from_local)
    let show_fancy = (user.logged_in && from_local)
    return (
        <div className="tdb__loading__parent">
            {loading &&  <Loading type={TERMINUS_COMPONENT} />}
            {(allow_remote && !show_fancy) &&
                <DBCreateHeader local={local} toggle={toggleLocal}/>
            }
            {(!allow_remote && !show_fancy) &&
                <DBLocalCreateHeader />
            }



            <Row className="generic-message-holder">
                {report &&
                    <TerminusDBSpeaks report={report} />
                }
            </Row>

            <Row>
                {local &&
                    <DBDetailsForm buttons={buttons} onSubmit={onCreate} logged_in={show_fancy} from_local={from_local} />
                }
                {!local &&
                    <DBRemoteForm onSubmit={createRemote}/>
                }
            </Row>

        </div>
    )
}

export const DBShareForm = ({onSubmit, starter}) => {
    const {remoteClient, bffClient, remoteEnriched } = WOQLClientObj()
    if(!remoteEnriched) return null
    let u = bffClient.user()
    let smeta = {}
    for(var k in starter){
        smeta[k] = starter[k]
    }
    smeta.hub_url = remoteClient.server()
    let o = u.organizations[0]
    for(var k in o){
        smeta[k] = o[k]
    }
    smeta.public = true;
    function doSubmit(doc){
        delete(doc['remote_url'])
        onSubmit(doc)
    }
    return (<DBCreateCard start={smeta} onSubmit={doSubmit} organizations={u.organizations} databases={bffClient.databases()} type="share"/>)
}

export const DBRemoteForm = ({onSubmit}) => {
    const {remoteClient, bffClient, remoteEnriched } = WOQLClientObj()
    if(!remoteEnriched) return null
    let u = bffClient.user()
    let org = u.organizations[0]
    let smeta = {
        id: "",
        label: "",
        comment: "",
        icon: "",
        schema: true,
        public: true,
    }
    for(var k in org){
        smeta[k] = org[k]
    }
    smeta.hub_url = remoteClient.server()
    function doSubmit(doc){
        onSubmit(doc)
    }

    return (<DBCreateCard start={smeta} onSubmit={doSubmit} organizations={u.organizations} databases={bffClient.databases()}  type="create" />)
}
