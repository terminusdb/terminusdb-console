import React, {useState} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import Loading from '../../components/Reports/Loading'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {COPY_REMOTE_FORM, COPY_DB_DETAILS_FORM} from './constants.createdb'
import {goDBHome} from '../../components/Router/ConsoleRouter'
import {APIUpdateReport} from '../../components/Reports/APIUpdateReport'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'
import {UnderConstruction} from '../../components/Reports/UnderConstruction'

export const CopyRemoteForm = () => {
    const {woqlClient, reconnectToServer} = WOQLClientObj()
    const {loading, user} = useAuth0()
    const [updateLoading, setUpdateLoading] = useState(false)
    const [report, setReport] = useState()
    const [sourceURL, setSourceURL] = useState()

    let update_start = Date.now()

    let basicInfo = {}
    let fields = COPY_REMOTE_FORM.fields

    //build values and options from database options
    COPY_REMOTE_FORM.fields.map((item, index) => {
        basicInfo[item.id] = item.value || ''
    })

    function onChangeBasics(field_id, value) {
        if (field_id == 'dbsource') {
            setSourceURL(value)
        }
    }

    //we should really do some behind the scenes checking of auth situation before actually pulling the trigger, but oh well....
    function onClone(details) {
        if (!sourceURL) return
        update_start = Date.now()
        setUpdateLoading(true)

        let nClient = woqlClient.copy()

        if (details.user && details.password) {
            nClient.remote_auth({type: 'basic', key: details.password, user: details.user})
        }
        let newid = details.newid || sourceURL.substring(sourceURL.lastIndexOf('/') + 1)
        let src = {
            remote_url: sourceURL,
            label: details.name || newid,
        }
        if (details.description) src.comment = details.description
        nClient.organization(woqlClient.user_organization()) //create new db in current user's organization
        return nClient
            .clonedb(src, newid)
            .then(() => {
                let message = `${COPY_REMOTE_FORM.cloneSuccessMessage} (id: ${sourceURL})`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterCreate(newid, rep)
            })
            .catch((err) => {
                let message = `${COPY_REMOTE_FORM.cloneFailureMessage} (id: ${sourceURL}) `
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setUpdateLoading(false)
            })
    }

    /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, rep) {
        reconnectToServer().then((result) => {
            goDBHome(id, woqlClient.user_organization(), rep)
        })
    }

    let buttons = user ? COPY_REMOTE_FORM.buttons : true
    //let buttons = COPY_REMOTE_FORM.buttons

    return (
        <>
            {(loading || updateLoading) && <Loading type={TERMINUS_COMPONENT} />}
            {report && report.error && (
                <APIUpdateReport
                    status={report.status}
                    error={report.error}
                    message={report.message}
                    time={report.time}
                />
            )}
            {!user && (
                <TCSubmitWrap>
                    <UnderConstruction action={COPY_REMOTE_FORM.actionText} />
                </TCSubmitWrap>
            )}
            <TCForm
                onSubmit={onClone}
                layout={[1, 2, 2, 1]}
                noCowDucks
                onChange={onChangeBasics}
                fields={fields}
                buttons={buttons}
            />
        </>
    )
}
