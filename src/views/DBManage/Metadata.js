/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {COPY_DB_DETAILS_FORM} from '../CreateDB/constants.createdb'
import {METADATA_FORM} from './constants.dbmanage'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {ACCESS_FAILURE, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {useAuth0} from '../../react-auth0-spa'
import {UnderConstruction} from '../../components/Reports/UnderConstruction'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'

export const Metadata = ({onCancel, onCreate, onEdit, visible}) => {
    const {woqlClient, reconnectServer} = WOQLClientObj()
    const [report, setReport] = useState()

    let rec = woqlClient.connection.getDBMetadata(
        woqlClient.db(),
        woqlClient.organization() || woqlClient.uid(),
    )
    if (!rec) return <TerminusDBSpeaks failure={ACCESS_FAILURE} />
    let values = {
        dbid: rec.db,
        dbname: rec.title,
        description: rec.description,
    }
    const {loading, user} = useAuth0()

    let buttons = user ? METADATA_FORM.buttons : false

    return (
        <>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            {report && report.error && <TerminusDBSpeaks report={report} />}
            {!user && (
                <TCSubmitWrap>
                    <UnderConstruction action={METADATA_FORM.actionText} />
                </TCSubmitWrap>
            )}
            <TCForm
                layout={[2, 1]}
                noCowDucks
                fields={COPY_DB_DETAILS_FORM.fields}
                values={values}
                buttons={buttons}
            />
        </>
    )
}
