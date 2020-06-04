import React, { useState } from "react"
import { SYSTEM_ERROR, SYSTEM_ERROR_CSS, HIDE_ERROR_DETAILS, SHOW_ERROR_DETAILS, SHOW_ERROR_DETAILS_CSS, 
    SYSTER_ERROR_MSG_CSS, SYSTER_ERROR_TITLE_CSS, UNKNOWN_ERROR } from "./constants.reports"

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


    let showf = ((error && Object.keys(error).length) ? true : false)

    if(!detmsg) detmsg = UNKNOWN_ERROR

    return (
        <span className={SYSTEM_ERROR_CSS}>
            {SYSTEM_ERROR.title && 
                <span className={SYSTER_ERROR_TITLE_CSS}>
                    {SYSTEM_ERROR.title}
                </span>
            }
            { detmsg && 
                <span className={SYSTER_ERROR_MSG_CSS}>
                    {detmsg}
                </span>
            }
            {showf  && 
                <span onClick={toggleFull} className={SHOW_ERROR_DETAILS_CSS}>
                    {show_hide}
                </span>
            }
            {(showFull && showf) && 
                <pre>
                    {JSON.stringify(error, false, 2)}
                </pre>
            }
        </span>
    )
}