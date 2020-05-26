/**
 * Controller application for metadata update form
 */
import React, {useState} from "react";
import {TCForm, TCSubmitWrap} from  "../../components/Form/FormComponents"
import { MERGE_BRANCH_FORM, MERGE_BUTTON } from "./constants.dbmanage"
import { Button } from "reactstrap";

export const Metadata = ({onCancel, onCreate, onEdit, visible, report}) => {
    visible = visible || false
    const [isVisible, setVisible] = useState(visible)

    if(!isVisible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={() => setVisible(true)} outline color="secondary">
                    {MERGE_BUTTON}
                </Button>
            </TCSubmitWrap>            
        )
    }

    let btns = MERGE_BRANCH_FORM.buttons
    btns.onCancel = function(){
        setVisible(false)
    }

    return (
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            fields={MERGE_BRANCH_FORM.fields}
            buttons={btns} 
        />       
    )
}