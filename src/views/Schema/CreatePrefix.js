import React from "react";
import {TCForm, TCSubmitWrap} from  "../../components/Form/FormComponents"
import { CREATE_PREFIX_FORM } from "./constants.schema"
import { Button } from "reactstrap";

export const CreatePrefix = ({onCancel, onCreate, onEdit, visible, report}) => {
    let vals = {}
    CREATE_PREFIX_FORM.fields.map((item) => {
        vals[item.id] = item.value || ""
    })

    if(!visible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={onEdit} outline color="secondary">
                    {CREATE_PREFIX_FORM.buttons.submitText}
                </Button>
            </TCSubmitWrap>            
        )
    }

    let btns = CREATE_PREFIX_FORM.buttons
    btns.onCancel = onCancel

    return (
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2]}
            fields={CREATE_PREFIX_FORM.fields}
            values={vals}
            buttons={btns} 
        />       
    )
}