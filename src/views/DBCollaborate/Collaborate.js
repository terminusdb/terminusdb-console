import React from "react";
import { Pull } from "./Pull"
import { Share } from "./Share"
import { Users } from "./Users"
import { DBContextObj } from "../../components/Query/DBContext"
import Loading from "../../components/Reports/Loading"

import {COLLABORATE_SECTIONS, COLLABORATE_SOON} from "./constants.dbcollaborate"
import {RiverOfSections} from "../Templates/RiverOfSections"
import { TERMINUS_COMPONENT } from "../../constants/identifiers";

export const Collaborate = (props) => {
    const {repos} = DBContextObj();

    if(!repos) return (<Loading type={TERMINUS_COMPONENT} />)
    let hasPrinciple = repos.local_clone || repos.remote  
    let sections = (hasPrinciple ? [COLLABORATE_SECTIONS[0], COLLABORATE_SECTIONS[1]] : [COLLABORATE_SECTIONS[0], COLLABORATE_SECTIONS[2]])
    return (<>
        <RiverOfSections sections={sections} label={props.label}>
            <Users key="users"/>
            {hasPrinciple && 
                <Pull key="pull" />
            }   
            {!hasPrinciple && 
                <Share key="share" />
            }
        </RiverOfSections>                        
        </>
    )
}

