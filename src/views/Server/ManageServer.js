import React from "react";
import { SERVER_SECTIONS } from "./constants.server"
import { RiverOfSections } from "../Templates/RiverOfSections"
import { goDBHome } from "../../components/Router/ConsoleRouter";

export const ManageServer = (props) => {
    return (
        <RiverOfSections sections={SERVER_SECTIONS} label="Server Configuration">
            <ManageSection key='v1' section="details" />
            <ManageSection key='v4' section="terminus" />
        </RiverOfSections>
    )
}

export const ManageSection = ({section}) => {
    if(section == "details"){ 
        return (<div>We need to know what to put here</div>)
    }
    if(section == "terminus"){
        goDBHome("terminus")
        return (<span>why me</span>)
    }
}
