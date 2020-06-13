/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import {TCForm} from  "../../components/Form/FormComponents"
import { PULL_FORM } from "./constants.dbcollaborate"

export const Pull = ({onCancel, onCreate, onEdit, visible, report}) => {
    let btns = PULL_FORM.buttons

    return (
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            fields={PULL_FORM.fields}
            buttons={btns} 
        />       
    )
}


/* Pull

remote: "origin"
remote_branch: "name of branch"
pull_into: local_branch

pull to branch -> pull/admin/foo/local/branch/pull_into 


Push push/admin/foo/local/branch/something (source of the push)

Always just a local branch

Target "origin"
remote: "origin"
remote_branch: "name of branch" */
