/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import {TCForm, TCSubmitWrap} from  "../../components/Form/FormComponents"
import { MERGE_BRANCH_FORM } from "./constants.dbmanage"
import { useAuth0 } from "../../react-auth0-spa";
import { UnderConstruction } from "../../components/Reports/UnderConstruction"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";


export const Merge = ({onCancel, onCreate, onEdit, visible}) => {
    visible = visible || false
    const { loading, user } = useAuth0()
    const [report, setReport] = useState()

    
    let btns = (user ? MERGE_BRANCH_FORM.buttons : false)

    return (<>
        {(loading) && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        {(report && report.error) && 
            <TerminusDBSpeaks report={report} />
        }
        {!user && 
            <TCSubmitWrap>
                <UnderConstruction action={MERGE_BRANCH_FORM.actionText} />
            </TCSubmitWrap>
        }
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            fields={MERGE_BRANCH_FORM.fields}
            buttons={btns} 
        />       
    </>)
}
