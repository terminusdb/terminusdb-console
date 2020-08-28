import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import {
    TERMINUS_SUCCESS,
    TERMINUS_INFO,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import { APIUpdateReport } from '../../components/Reports/APIUpdateReport'
import { DBDetailsForm } from './DBDetails'
import { CloneDB, NewLocalLabel, NewLocalID } from '../../components/Query/CollaborateAPI'

export const CloneLocal = ({meta, woqlClient, onCancel, onClone, type}) => {
    const [loading, setLoading] = useState(false)
    let update_start = Date.now()
    let intro_message = "Cloning a local database creates an entirely new copy of the database, that can be changed independently, but remains connected to the original and can be synchronized"
    let clone_intro = {status: TERMINUS_INFO,  message: intro_message};
    const [report, setReport] = useState(clone_intro)
    const [starter, setStarter] = useState(getStarter(meta))

    function getSuccessMessage(doc ){
        return "Cloned database - clone has id " + doc.id + " and label " + doc.label
    }

    function getStarter(meta){
        let st = {}
        st.id = NewLocalID(meta.id, woqlClient)
        st.label = NewLocalLabel(meta.label, woqlClient)
        st.organization = meta.organization
        st.comment = meta.comment
        return st
    }

    function getErrorReport(e, doc, update_start){
        let rep = {
            status: TERMINUS_ERROR,
            message: "Failed to clone database " + doc.id,
            error: e,
            time: Date.now() - update_start
        }
        return rep
    }

    async function doClone(doc){
        if(!(type && type == "hub")){
            update_start = Date.now()
            if(setLoading) setLoading(true)
            doc.organization = woqlClient.user_organization()
            doc.remote_url = woqlClient.connectionConfig.cloneableURL()
            return CloneDB(doc, woqlClient, false, false, true)
            .then((local_id) => {
                afterClone(local_id, doc.organization, doc, getSuccessMessage(doc), Date.now()-update_start)
            })
            .catch((err) => setReport(getErrorReport(err, doc, update_start)))
            .finally(() => setLoading(false))
        }
        else onClone(doc)
    }

    function afterClone(id, organization, doc, message, update_start){
        let rep = {
            status: TERMINUS_SUCCESS,
            message: message,
            time: Date.now() - update_start,
        }
        setReport(rep)
        if(onClone) onClone(id, organization, doc)
    }

    let buttons = {
        submitText: "Create Clone",
        cancelText: "Cancel",
        onCancel: onCancel
    }

    return (
        <div className="tdb__loading__parent">
            {loading &&  <Loading type={TERMINUS_COMPONENT}/>}
            {report && report.error && (
                <APIUpdateReport
                    status={report.status}
                    error={report.error}
                    message={report.message}
                    time={report.time}
                />
            )}
            {report && !report.error && (
                <span className="database-list-intro">
                    <APIUpdateReport
                        status={report.status}
                        message={report.message}
                    />
                </span>
            )}
            {starter && 
                <DBDetailsForm buttons={buttons} onSubmit={doClone} from_local={starter} />
            }
        </div>
    )
}

