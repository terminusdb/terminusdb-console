import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import {
    TERMINUS_SUCCESS,
    TERMINUS_INFO,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import { goDBHome } from '../../components/Router/ConsoleRouter'
import { APIUpdateReport } from '../../components/Reports/APIUpdateReport'
import { DBDetailsForm } from './DBDetails'
import { CreateLocal } from '../../components/Query/CollaborateAPI'

export const CloneLocal = ({meta, woqlClient, onCancel, onClone}) => {
    const [loading, setLoading] = useState(false)

    let intro_message = "Cloning a local database creates an entirely new copy of the database, that can be changed independently, but remains connected to the original and can be synchronized"
    let clone_intro = {status: TERMINUS_INFO,  message: intro_message};
    const [report, setReport] = useState(clone_intro)

    function getSuccessMessage(doc ){
        return "Cloned database - clone has id " + doc.id + " and label " + doc.label
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

    async function onClone(doc){
        update_start = Date.now()
        if(setLoading) setLoading(true)
        doc.organization = woqlClient.user_organization()
        return CreateLocal(doc, woqlClient)
        .then((local_id) => {
            afterClone(local_id, doc.organization, getSuccessMessage(doc), Date.now()-update_start)
        })
        .catch((err) => setReport(getErrorReport(err, doc, update_start)))
        .finally(() => setLoading(false))
    }

    function afterClone(id, organization, message, update_start){
        woqlClient.db(id)
        let rep = {
            status: TERMINUS_SUCCESS,
            message: message,
            time: Date.now() - update_start,
        }
        setReport(rep)
        refreshDBRecord(id, organization)
        .then(() => goDBHome(id, organization, report))
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
            
            <DBDetailsForm buttons={buttons} onSubmit={onClone} from_local={meta} />
        </div>
    )
}

