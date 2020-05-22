import React from "react";
import {TCForm, TCSubmitWrap} from  "../../components/Form/FormComponents"
import { CREATE_GRAPH_FORM } from "./constants"
import { Button } from "reactstrap";

export const CreateGraph = ({onCancel, onCreate, onEdit, visible, report}) => {
    let vals = {}
    CREATE_GRAPH_FORM.fields.map((item) => {
        vals[item.id] = item.value || ""
    })

    if(!visible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={onEdit} outline color="secondary">
                    {CREATE_GRAPH_FORM.buttons.submitText}
                </Button>
            </TCSubmitWrap>            
        )
    }

    let btns = CREATE_GRAPH_FORM.buttons
    btns.onCancel = onCancel

    return (
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            fields={CREATE_GRAPH_FORM.fields}
            values={vals}
            buttons={btns} 
        />       
    )
}