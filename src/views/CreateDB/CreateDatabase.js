import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import { CREATE_DB_FORM } from './constants.createdb'
import { goDBHome } from '../../components/Router/ConsoleRouter'
import { APIUpdateReport } from '../../components/Reports/APIUpdateReport'
import { DBDetailsForm } from './DBDetails'
import {useAuth0} from '../../react-auth0-spa'

export const CreateDatabase = () => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState()
    const { getTokenSilently } = useAuth0();
    let update_start = Date.now()
    const {woqlClient, remoteClient, bffClient, reconnectToServer } = WOQLClientObj()
    /**
     * Creates a database and, if a schema graph is set, creates the main schema graph
     * On success, it fires up the home page of the database and rebuilds the list of databases
     */
    function onCreate(doc, schema) {
        update_start = Date.now()
        if(doc.sharing != "local"){
            let user = woqlClient.user()
            if(!user.logged_in){
                setReport({status: TERMINUS_WARNING, message: "If you are not logged in to terminusHub, you can only create local databases"})
                return false;
                //return Promise.reject(new URIError("Not Logged In"))

            }
            else {
                if(doc.sharing == 'public') doc.public = true
                delete(doc['sharing'])
                setLoading(true)
                return createRemote(doc, update_start, schema)
            }
        }
        setLoading(true)
        return createLocal(doc, update_start, schema)
    }

    function createLocal(doc, update_start, schema){
        return woqlClient.createDatabase(doc.id, doc)
        .then(() => {
            after_create_db(schema, update_start, get_remote_create_message(doc.label, doc.id), doc.id)
        })
        .catch((err) => process_error(err, update_start, create_local_failure(doc.label, doc.id)))
        .finally(() => setLoading(false))            
    }

    async function createRemote(doc, update_start, schema) {
        const jwtoken = await getTokenSilently()
        let hubcreds = {type: "jwt", key: jwtoken}
        bffClient.local_auth(hubcreds)
        woqlClient.remote_auth(hubcreds)
        let remote_org = remoteClient.user_organization()
        bffClient.createDatabase(doc.id, doc, remote_org)
        .then(() => {
            let sourceURL = remoteClient.server() + remote_org + "/" + doc.id
            let src = {
                remote_url: sourceURL,
                label: doc.label,
                comment: ""
            }
            return woqlClient.clonedb(src, doc.id)
            .then(() => {
                after_create_db(schema, update_start, get_local_create_message(doc.label, doc.id), doc.id)                    
            })
            .catch((err) => process_error(err, update_start, clone_remote_failure(doc.label, doc.id)))
        })
        .catch((err) => process_error(err, update_start, create_remote_failure(doc.label, doc.id)))
        .finally(() => setLoading(false))            
    }

    function after_create_db(schema, update_start, message, id){
        woqlClient.db(id)
        if (schema) {
            return createStarterGraph(update_start, message, id)
        } 
        message += CREATE_DB_FORM.noSchemaGraphMessage
        let rep = {
            message: message,
            status: TERMINUS_SUCCESS,
            time: Date.now() - update_start
        }
        setReport(rep)
        afterCreate(id, rep)
    }

    /**
     * Creates default main schema graph when chosen
     */
    function createStarterGraph(update_start, message, id) {
        return woqlClient.createGraph('schema', 'main', CREATE_DB_FORM.schemaGraphCommitMessage)
        .then(() => {
            let rep = {
                status: TERMINUS_SUCCESS,
                message: message,
                time: Date.now() - update_start,
            }
            setReport(rep)
            afterCreate(id, rep)
        })
        .catch((e) => {
            message += CREATE_DB_FORM.schemaFailedMessage
            let wrep = {
                message: message,
                error: e,
                status: TERMINUS_WARNING,
                time: Date.now() - update_start,
            }
            setReport(wrep)
            afterCreate(id, wrep)
        })
    }

    /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, mreport) {
        reconnectToServer().then(() => goDBHome(id, woqlClient.user_organization(), mreport))
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

    return (
        <>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            {report && report.error && (
                <APIUpdateReport
                    status={report.status}
                    error={report.error}
                    message={report.message}
                    time={report.time}
                />
            )}
            {report && !report.error && (
                <APIUpdateReport
                    status={report.status}
                    message={report.message}
                />
            )}
            <DBDetailsForm buttons={CREATE_DB_FORM.buttons} onSubmit={onCreate} />
        </>
    )
}
