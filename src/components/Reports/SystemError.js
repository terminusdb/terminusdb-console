import React, { useState } from "react"
import { SYSTEM_ERROR, SYSTEM_ERROR_CSS, HIDE_ERROR_DETAILS, SHOW_ERROR_DETAILS, SHOW_ERROR_DETAILS_CSS,
    SYSTER_ERROR_MSG_CSS, SYSTER_ERROR_TITLE_CSS, UNKNOWN_ERROR } from "./constants.reports"
import {constructErrorMessage, parseAPIMessage} from "./utils.vio"
import {isArray} from "../../utils/helperFunctions"

export const SystemError = ({error}) => {
    let msg=""
    const [showFull, setFull] = useState(false)

    if(error.data && error.data["system:message"]){
        msg = (error.data["system:message"]["@value"] ? error.data["system:message"]["@value"] : error.data["system:message"])
    }

    if(error.data && error.data["api:message"]){
        msg=constructErrorMessage(error)
    }

    function toggleFull(){
        setFull(!showFull)
    }

    const show_hide = (showFull ? HIDE_ERROR_DETAILS : SHOW_ERROR_DETAILS )
    let showf = ((error && Object.keys(error).length) ? true : false)
    if(!msg) msg = UNKNOWN_ERROR

    if(!error.data) return null

    let eMsg=parseAPIMessage(error.data["api:message"])


    return (
        <div className={SYSTEM_ERROR_CSS}>
            { isArray(msg) && msg.map (item => <div>
                    <span> {eMsg} </span>
                    <span className={SYSTER_ERROR_MSG_CSS}>
                        {item}
                    </span>
                </div>)
            }
            { !isArray(msg) && <span>{eMsg}</span>}
            {showf  && <span onClick={toggleFull} className={SHOW_ERROR_DETAILS_CSS}>
                {show_hide}
            </span>
            }
            {(showFull && showf) && <pre>
                {JSON.stringify(error, false, 2)}
            </pre>
            }
        </div>
    )
}
