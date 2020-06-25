/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { TCForm, TCSubmitWrap } from  "../../components/Form/FormComponents"
import { CREATE_REMOTE_FORM } from "../CreateDB/constants.createdb"
import { UnderConstruction } from "../../components/Reports/UnderConstruction"


export const Share = ({onCancel, onCreate, onEdit, report}) => {
    const { loading, user } = useAuth0();

    let buttons = (user ? CREATE_REMOTE_FORM.buttons : true)

    return (<>
        {!user &&
            <TCSubmitWrap>
                <UnderConstruction action={CREATE_REMOTE_FORM.shareText}/>
            </TCSubmitWrap>
        }
        <TCForm
            onSubmit={onCreate}
            layout = {[2, 3, 1, 2, 1, 1, 1]}
            fields={CREATE_REMOTE_FORM.fields}
            buttons={buttons}
        /></>
    )
}
