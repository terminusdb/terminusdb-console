import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {CREATE_REMOTE_FORM} from './constants.createdb'
import {goDBHome} from '../../components/Router/ConsoleRouter'
import {APIUpdateReport} from '../../components/Reports/APIUpdateReport'
import {AccessControlErrorPage} from '../../components/Reports/AccessControlErrorPage'
import {UnderConstruction} from '../../components/Reports/UnderConstruction'
import {useAuth0} from '../../react-auth0-spa'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'
import TerminusClient from '@terminusdb/terminusdb-client'

export const CreateRemoteForm = () => {
    let update_start = Date.now()
    const {woqlClient} = WOQLClientObj()
    const {loading, user, getTokenSilently} = useAuth0()
    const [updateLoading, setUpdateLoading] = useState(false)
    const [report, setReport] = useState()
    const details = CREATE_REMOTE_FORM.sample
    
    const getJWT = async () => {
        const token = await getTokenSilently()
        return token
    }
    
    /**
     * Creates the database and, if a schema graph is set, creates the main schema graph
     * On success, it fires up the home page of the database and rebuilds the list of databases
     */
    const onCreate = async (doc) => {
        let dbdoc = {
            id: doc.dbid,
            label: doc.dbname,
        }
        if(doc.audience){
            dbdoc.public
        }
        if(doc.decscription){
            dbdoc.comment = doc.description
        }
        setReport(false)
        getTokenSilently()
        const jwtoken = await getJWT()
        let url = "https://hub-dev.dcm.ist/"
        const hubClient = new TerminusClient.WOQLClient(url)
        hubClient.local_auth({type: "jwt", key: jwtoken})
        hubClient.organization(user.nickname)
        hubClient.author(user.email)
        hubClient.createDatabase(dbdoc.id, dbdoc)
        .then(() => {
            alert("success")
        })
        .catch((e) => {
            setReport({
                error: e,
                status: TERMINUS_ERROR,
                message: 'Adding Database - Error From Terminus Hub',
            })
        })
        /**
         * This is where we patch in the mini hub-client that creates the database online
         */

    }
    let buttons = user ? CREATE_REMOTE_FORM.buttons : false

    return (
        <>
            {(loading || updateLoading) && <Loading type={TERMINUS_COMPONENT} />}
            {report && (
                <APIUpdateReport
                    status={report.status}
                    error={report.error}
                    message={report.message}
                    time={report.time}
                />
            )}
            {!user && (
                <TCSubmitWrap>
                    <UnderConstruction action={CREATE_REMOTE_FORM.actionText} />
                </TCSubmitWrap>
            )}
            <TCForm
                onSubmit={onCreate}
                layout={[2, 3, 1, 2, 1, 1, 1]}
                fields={CREATE_REMOTE_FORM.fields}
                values={details}
                buttons={buttons}
            />
        </>
    )
}
