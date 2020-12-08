import React, { useState } from "react"
import { SYSTEM_ERROR, SYSTEM_ERROR_CSS, HIDE_ERROR_DETAILS, SHOW_ERROR_DETAILS, SHOW_ERROR_DETAILS_CSS,
    SYSTER_ERROR_MSG_CSS, SYSTER_ERROR_TITLE_CSS, UNKNOWN_ERROR } from "./constants.reports"
import * as vios from "./constants.vios"


export const SystemError = ({error}) => {
    let msg="", msgObject = {}
    const [showFull, setFull] = useState(false)

    if(error.data && error.data["system:message"]){
        msg = (error.data["system:message"]["@value"] ? error.data["system:message"]["@value"] : error.data["system:message"])
    }

    function processErrorWitness (wit){
        let obj={}
        wit.map(item => {
            for (var key in item) {
                switch(key){
                    case vios.WITNESS_TYPE:
                        obj.type=item[key]
                        break
                    case vios.WITNESS_PROPERTY:
                        let val=item[key]["@value"]
                        if(val==undefined)
                            obj.property=item[key]
                        else obj.property=val
                        break
                    case vios.WITNESS_CLASS:
                        obj.class=item[key]["@value"]
                        break
                    case vios.WITNESS_BASE_TYPE:
                        obj.baseType=item[key]["@value"]
                        break
                    case vios.WITNESS_LITERAL:
                        obj.literal=item[key]["@value"]
                        break
                    case vios.WITNESS_MESSAGE:
                        obj.message=item[key]
                        break
                    case vios.WITNESS_SUBJECT:
                        obj.subject=item[key]
                        break
                    case vios.WITNESS_PARENT_TYPE:
                        break
                    default:
                        console.log("Invalid Witness key " + key + " found in SystemError.js")
                        break
                }
            }
        })
        return obj
    }

    function processApiMessage(apiMsg) {
        if(apiMsg.includes(vios.VIOLATION_WOQL_SYNTAX_ERROR))
            return "Syntax error found"
        else if (apiMsg.includes(vios.VIOLATION_KEY_HAS_UNKNOWN_PREFIX))
            return "Key has unknown prefix"
        else return apiMsg
    }

    if(error.data && error.data["api:message"]){
        msg=processApiMessage(error.data["api:message"])
        if(error.data["api:error"]) {
            let wit=error.data["api:error"] ["api:witnesses"]
            msgObject=processErrorWitness(wit)

            switch(msgObject.type){
                case vios.VIOLATION_WITH_DATA_TYPE_OBJECT:
                    msg=msg + ". " + msgObject.literal + " is " + msgObject.message + " for "
                    if(msgObject.property) {
                        msg=msg + " Property " + msgObject.property
                    }
                    msg=msg + " of type " + msgObject.baseType
                    break
                case vios.VIOLATION_UNTYPES_INSTANCE:
                    msg=msg + " for "
                    if(msgObject.property) {
                        msg=msg + " Property " + msgObject.property
                    }
                    msg=msg + ". " + msgObject.message["@value"]
                    break
                case vios.VIOLATION_DATA_TYPE_SUBSUMPTION:
                    msg=msg + " for document " + msgObject.subject + ". "
                    if(msgObject.property) {
                        msg=msg + "Expecting type " + msgObject.baseType + " for property " + msgObject.property + ". "
                    }
                    break
                default:
                    console.log("Invalid Vio type " + msgObject.type + " found in SystemError.js")
                    break
            }
        }
    }

    function toggleFull(){
        setFull(!showFull)
    }

    const show_hide = (showFull ? HIDE_ERROR_DETAILS : SHOW_ERROR_DETAILS )
    let showf = ((error && Object.keys(error).length) ? true : false)
    if(!msg) msg = UNKNOWN_ERROR

    return (
        <div className={SYSTEM_ERROR_CSS}>
            {SYSTEM_ERROR.title &&
                <span className={SYSTER_ERROR_TITLE_CSS}>
                    {SYSTEM_ERROR.title}
                </span>
            }
            { msg && <span className={SYSTER_ERROR_MSG_CSS}>
                {msg}
            </span>
            }
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
