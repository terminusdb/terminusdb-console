import React, { useState } from "react"
import { SYSTEM_ERROR, SYSTEM_ERROR_CSS, HIDE_ERROR_DETAILS, SHOW_ERROR_DETAILS, SHOW_ERROR_DETAILS_CSS,
    SYSTER_ERROR_MSG_CSS, SYSTER_ERROR_TITLE_CSS, UNKNOWN_ERROR } from "./constants.reports"
import * as vios from "./constants.vios"
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'

export const SystemError = ({error}) => {
    let msg="", msgObject = {}
    const {woqlClient} = WOQLClientObj()
    const [showFull, setFull] = useState(false)

    if(error.data && error.data["system:message"]){
        msg = (error.data["system:message"]["@value"] ? error.data["system:message"]["@value"] : error.data["system:message"])
    }

    function parseWitnesses (wit){
        let obj={}
        wit.map(item => {
            for (var key in item) {
                switch(key){
                    case vios.WITNESS_TYPE:
                        obj.type=item[key]
                        break
                    case vios.WITNESS_PROPERTY:
                        var val=item[key]["@value"]
                        if(val==undefined)
                            obj.property=`${TerminusClient.UTILS.shorten(item[key])}`
                        else
                            obj.property=val
                        break
                    case vios.WITNESS_CLASS:
                        obj.class=item[key]["@value"]
                        break
                    case vios.WITNESS_BASE_TYPE:
                        obj.baseType= `${TerminusClient.UTILS.shorten(item[key]["@value"])}`
                        break
                    case vios.WITNESS_LITERAL:
                        obj.literal=item[key]["@value"]
                        break
                    case vios.WITNESS_MESSAGE:
                        obj.message=item[key]
                        break
                    case vios.WITNESS_SUBJECT:
                        var val=item[key]["@value"]
                        if(val==undefined)
                            obj.subject=`${TerminusClient.UTILS.shorten(item[key])}`
                        else
                            obj.subject=`${TerminusClient.UTILS.shorten(val)}`
                        break
                    case vios.WITNESS_PARENT_TYPE:
                        obj.parent=`${TerminusClient.UTILS.shorten(item[key]["@value"])}`
                        break
                    default:
                        console.log("Invalid Witness key " + key + " found in SystemError.js")
                        break
                }
            }
        })
        return obj
    }

    function parseAPIMessage(apiMsg) {
        if(apiMsg.includes(vios.VIOLATION_WOQL_SYNTAX_ERROR))
            return "Syntax error found"
        else if (apiMsg.includes(vios.VIOLATION_KEY_HAS_UNKNOWN_PREFIX))
            return "Key has unknown prefix"
        else return apiMsg
    }

    function constructDataTypeObjectVio (msgObject) {
        let text=""
        text=text + ". " + msgObject.literal + " is " + msgObject.message + " for "
        if(msgObject.property) {
            text=text + " Property " + `${TerminusClient.UTILS.shorten(msgObject.property)}`
        }
        text=text + " of type " + msgObject.baseType
        return text
    }

    function constructUntypedInstanceVio(msgObject) {
        let text=""
        text=text + " for "
        if(msgObject.property) {
            text=text + " Property " + `${TerminusClient.UTILS.shorten(msgObject.property)}`
        }
        text=text + ". " + msgObject.message["@value"]
        return text
    }

    function constructDataTypeSubsumtionVio (msgObject) {
        let text=""
        text=text + " for document " + msgObject.subject + ". "
        if(msgObject.property) {
            text=text + "Expecting type " + msgObject.baseType + " for property " + msgObject.property + ". "
        }
        return text
    }

    function constructClassVio (msgObject) {
        let m=msgObject.message["@value"], rep="", text=""
        if(m.includes(msgObject.class)) {
            rep=m.replace(msgObject.class, `${TerminusClient.UTILS.shorten(msgObject.class)}`)
        }
        text=text + ". " + rep
        return text
    }

    function constructPropertyVio (msgObject) {
        let m=msgObject.message["@value"], rep="", text=""
        if(m.includes(msgObject.property)) {
            rep=m.replace(msgObject.property, `${TerminusClient.UTILS.shorten(msgObject.property)}`)
        }
        text=text + ". " + rep
        return text
    }

    function constructClassCycleVio (msgObject) {
        let text=""
        text = text + ". " + msgObject.message["@value"]
        return text
    }

    function constructDefaultVio (msgObject) {
        let val=msgObject.message["@value"], text=""
        if(val==undefined)
            text= text + ". " + msgObject.message
        else text= text + ". " + val
        return text
    }

    if(error.data && error.data["api:message"]){
        msg=parseAPIMessage(error.data["api:message"])

        // parse witnesses
        if(error.data["api:error"] && error.data["api:error"]["api:witnesses"]) {
            let wit=error.data["api:error"]["api:witnesses"]
            msgObject=parseWitnesses(wit)
            switch(msgObject.type){
                case vios.VIOLATION_WITH_DATA_TYPE_OBJECT:
                    msg= msg + constructDataTypeObjectVio(msgObject)
                    break
                case vios.VIOLATION_UNTYPED_INSTANCE:
                    msg= msg + constructUntypedInstanceVio(msgObject)
                    break
                case vios.VIOLATION_DATA_TYPE_SUBSUMPTION:
                    msg= msg + constructDataTypeSubsumtionVio(msgObject)
                    break
                case vios.VIOLATION_INVALID_CLASS_VIOLATION:
                case vios.VIOLATION_CLASS_INHERITANCE:
                    if(msgObject.class) {
                        msg= msg + constructClassVio(msgObject)
                    }
                    break
                case vios.VIOLATION_PROPERTY_WITH_UNDEFINED_DOMAIN:
                    if(msgObject.property){
                        msg=msg + constructPropertyVio(msgObject)
                    }
                    break
                case vios.VIOLATION_CLASS_CYCLE:
                    msg=msg + constructClassCycleVio(msgObject)
                    break
                default:
                    msg = msg + constructDefaultVio(msgObject)
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
