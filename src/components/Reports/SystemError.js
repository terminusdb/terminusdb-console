import React, { useState } from "react"
import { SYSTEM_ERROR, SYSTEM_ERROR_CSS, HIDE_ERROR_DETAILS, SHOW_ERROR_DETAILS, SHOW_ERROR_DETAILS_CSS, 
    SYSTER_ERROR_MSG_CSS, SYSTER_ERROR_TITLE_CSS } from "./constants"

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
            <span className={SYSTER_ERROR_TITLE_CSS}>
                {SYSTEM_ERROR.title}
            </span>
            <span className={SYSTER_ERROR_MSG_CSS}>
                {detmsg}
            </span>
            <span onClick={toggleFull} className={SHOW_ERROR_DETAILS_CSS}>{show_hide}</span>
            {showFull && 
                <pre>
                    {JSON.stringify(error, false, 2)}
                </pre>
            }
        </span>
    )
}