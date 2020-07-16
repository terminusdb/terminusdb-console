/**
 * Controller application for metadata update form
 */
import React, {useState} from 'react'
import {BACKUP_FORM} from './constants.dbmanage'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {TERMINUS_COMPONENT} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {useAuth0} from '../../react-auth0-spa'
import {UnderConstruction} from '../../components/Reports/UnderConstruction'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'

export const Backup = ({onCancel, onCreate, onEdit, visible}) => {
    const {loading, user} = useAuth0()
    const [report, setReport] = useState()
    let buttons = user ? BACKUP_FORM.buttons : false

    return (
        <>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            {report && report.error && <TerminusDBSpeaks report={report} />}
            {!user && (
                <TCSubmitWrap>
                    <UnderConstruction action={BACKUP_FORM.actionText} />
                </TCSubmitWrap>
            )}
            <TCForm layout={[3, 1]} noCowDucks fields={BACKUP_FORM.fields} buttons={buttons} />
        </>
    )
}
