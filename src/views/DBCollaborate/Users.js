/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { MANAGE_COLLABORATORS } from "./constants.dbcollaborate"
import { TCForm, TCSubmitWrap } from  "../../components/Form/FormComponents"
import { UnderConstruction } from "../../components/Reports/UnderConstruction"

export const Users = () => {
//if the db is hosted on hub -> we show super cool stuff
//otherwise we show a very boring and low-level capabilities management screen

    const { loading, user } = useAuth0();

    return (<>
        {/*<span>Users .. coming soon</span>*/}
        {!user &&
            <TCSubmitWrap>
                <UnderConstruction action={MANAGE_COLLABORATORS.actionText}/>
            </TCSubmitWrap>
        }</>
    )
}
