/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { TCForm } from  "../../components/Form/FormComponents"
import { CREATE_REMOTE_FORM } from "../createDB/constants.createdb"


export const Share = ({onCancel, onCreate, onEdit, report}) => {


    return (
        <TCForm
            onSubmit={onCreate}
            layout = {[2, 3, 1, 2, 1, 1, 1]}
            fields={CREATE_REMOTE_FORM.fields}
            buttons={CREATE_REMOTE_FORM.buttons}
        />
    )
}