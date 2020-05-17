import React, { useState } from "react"
import { SYSTEM_ERROR, SYSTEM_ERROR_CSS, HIDE_ERROR_DETAILS, SHOW_ERROR_DETAILS, SHOW_ERROR_DETAILS_CSS } from "./constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "../../constants/faicons"

export const SystemError = ({error}) => {
    const [showFull, setFull] = useState(false) 
    let detmsg = ""
    if(error.data && error.data["terminus:message"]){
        detmsg = (error.data["terminus:message"]["@value"] ? error.data["terminus:message"]["@value"] : error.data["terminus:message"])
    }

    function toggleFull(){
        setFull(!showFull)
    }

    const show_hide = (showFull ? HIDE_ERROR_DETAILS : SHOW_ERROR_DETAILS ) 

    return (
        <span className={SYSTEM_ERROR_CSS}>
            <FontAwesomeIcon icon={icons.ERROR} className="mr-3"/>
            <strong>{SYSTEM_ERROR.title}</strong>
            {detmsg}
            <span onClick={toggleFull} className={SHOW_ERROR_DETAILS_CSS}>{show_hide}</span>
            {showFull && 
                <Container>
                    {JSON.stringify(error, false, 2)}
                </Container>
            }
        </span>
    )
}