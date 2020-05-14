import React, { useState, useEffect } from "react";
import { Alert } from 'reactstrap';
import { isObject } from "../../utils/helperFunctions"
import * as tag from "../../labels/tags"
import * as reportAlert from "../../labels/reportLabels"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {VIOLATION_DETECTED, VIOLATIONS_DETECTED} from "./constants"

export const ViolationReport = ({violations, tone}) => {
    let vioBuff = violations.map((item) => {
        return (<TerminusViolation vio={item} />)
    })
    let vcount = vioBuff.length + " " + (vioBuff.length > 1 ? {VIOLATIONS_DETECTED} : {VIOLATION_DETECTED})
    if(!vioBuff) return null    
    return (
        <span className = "result-reports">
            <Alert color = {tone}>
                <b>{vcount}</b>
                {vioBuff}
            </Alert >
        </span>
    )
}

const TerminusViolation = ({vio}) => {
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
        <div key={item} className = "terminus-violation">
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
        <span className="terminus-violation-property">
            <label className="terminus-violation-property-label">{property}</label>
            <span className="terminus-violation-property-value">{mval}</span>
        </span>
    )
}

export const hasViolations = (err) => {
    if(err.data && err.data['terminus:witnesses']){
        return true
    }
    else if(err.data && Array.isArray(err.data)){
        return true
    }
    return false
}

export const getViolations = (err) => {
    if(err.data && err.data['terminus:witnesses']){
        return err.data['terminus:witnesses']
    }
    else if(err.data && Array.isArray(err.data)){
        return err.data
    }
}