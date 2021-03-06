import React from "react";
import { Alert } from "react-bootstrap" //replace;
import {VIOLATION_DETECTED, VIOLATIONS_DETECTED, VIOLATIONS_CSS, VIOLATION_CSS,
    VIOLATION_PROPERTY_CSS, VIOLATION_PROPERTY_LABEL_CSS, VIOLATION_PROPERTY_VALUE_CSS} from "./constants.reports"

export const ViolationReport = ({violations, tone}) => {
   
    let vioBuff = violations.map((item, index) => {
        return (<TerminusViolation key={"_"+index} vio={item} />)
    })
    let vcount = vioBuff.length + " " + (vioBuff.length > 1 ? VIOLATIONS_DETECTED : VIOLATION_DETECTED)
    if(!vioBuff) return null
    return (
        <span className = {VIOLATIONS_CSS}>
            <Alert variant = {tone}>
                <b>{vcount}</b>
                {vioBuff}
            </Alert >
        </span>
    )
}

export const TerminusViolation = ({vio}) => {
    let vioParts = []
    let msg = false

    if(vio['vio:message'] && vio['vio:message']["@value"]){
        msg = vio['vio:message']["@value"]
    }

    for(var prop in vio){
        if(prop != "vio:message" && prop != "@type"){
            vioParts.push(<ViolationProperty property={prop} value={vio[prop]} />)
        }
    }
    return (
        <div className={VIOLATION_CSS}>
            {msg &&
                <strong>{msg}</strong>
            }
            {vioParts}
        </div>
    )
}

const ViolationProperty = ({property, value}) => {
    let mval = value["@value"] || value;
    if(!mval) return null
    if(typeof mval == "object") mval = JSON.stringify(mval)
    return (
        <span className={VIOLATION_PROPERTY_CSS}>
            <label className={VIOLATION_PROPERTY_LABEL_CSS}>{property}</label>
            <span className={VIOLATION_PROPERTY_VALUE_CSS}>{mval}</span>
        </span>
    )
}

export const hasViolations = (err) => {
    if(!err) return false
    if(!err.data && err.response && err.response.data) err.data = err.response.data
    if(err.data && err.data['system:witnesses']){
        return true
    }
    else if(err.data && Array.isArray(err.data)){
        return true
    }
    return false
}

export const getViolations = (err) => {
    if(!err.data && err.response && err.response.data) err.data = err.response.data
    if(err.data && err.data['system:witnesses']){
        return err.data['system:witnesses']
    }
    else if(err.data && Array.isArray(err.data)){
        return err.data
    }
}
