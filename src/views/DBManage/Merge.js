/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import {TCForm} from  "../../components/Form/FormComponents"
import { MERGE_BRANCH_FORM } from "./constants.dbmanage"

export const Merge = ({onCancel, onCreate, onEdit, visible, report}) => {
    visible = visible || false

    let btns = MERGE_BRANCH_FORM.buttons

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