/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import {TCForm, TCSubmitWrap} from  "../../../components/Form/FormComponents"
import { CREATE_BRANCH_FORM, BRANCH_BUTTON } from "../constants"
import { Button } from "reactstrap";
import { HistoryNavigator} from "../../../components/HistoryNavigator/HistoryNavigator"

export const CreateBranch = ({onCancel, onCreate, onEdit, visible, report}) => {
    visible = visible || false
    const [isVisible, setVisible] = useState(visible)

    if(!isVisible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={() => setVisible(true)} outline color="secondary">
                    {BRANCH_BUTTON}
                </Button>
            </TCSubmitWrap>            
        )
    }

    let btns = CREATE_BRANCH_FORM.buttons
    btns.onCancel = function(){
        setVisible(false)
    }

    function headChanged(branch, ref){
        alert(branch + " " + ref)
    }

    return (        
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            fields={CREATE_BRANCH_FORM.fields}
            buttons={btns} 
        >
            <HistoryNavigator onHeadChange={headChanged} />
        </TCForm>       
    )
}