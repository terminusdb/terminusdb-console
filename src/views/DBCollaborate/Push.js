/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import {TCForm} from  "../../components/Form/FormComponents"
import { PUSH_FORM } from "./constants.dbcollaborate"

export const Push = ({onCancel, onCreate, onEdit, visible, report}) => {
    visible = visible || false

    let btns = PUSH_FORM.buttons

    return (
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            fields={PUSH_FORM.fields}
            buttons={btns} 
        />       
    )
}