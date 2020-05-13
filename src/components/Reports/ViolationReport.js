import React, { useState, useEffect } from "react";
import { Alert } from 'reactstrap';
import { isObject } from "../../utils/helperFunctions"
import * as tag from "../../labels/tags"
import * as reportAlert from "../../labels/reportLabels"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ViolationReport = (props) => {
    const results = props.results || {};
    const report = props.report || {};
    let message = props.report.message || tag.BLANK, alert = reportAlert.SUCCESS_COLOR;
    let vioMessage = {}, printVios = [];

    /********Terminus Violation functions **********/
    function getPropertyAsDOM (prop, val){
        let mval = val["@value"] || val;
	    if(mval && typeof mval != "object")
            vioMessage.details.push({prop: prop, mval:mval})
    }

    function TerminusViolation (vio) {
        if(vio['@type']){
		    let msg = vio['vio:message'] || {"@value": ""};
		    getPropertyAsDOM(vio["@type"], msg);
	   }
       for(var prop in vio){
     	 if(prop != "vio:message" && prop != "@type")
    	    getPropertyAsDOM(prop, vio[prop]);
    	}
    }

    function TerminusViolations(vios) {
        let nvios = [], vioBuff = [];
        vioMessage.details = [];
        for(var i = 0; i<vios.length; i++)
            nvios.push(vios[i]);
    	for(var i = 0; i<nvios.length; i++)
            vioBuff.push(TerminusViolation(nvios[i]));
        let message = vioBuff.length + (vioBuff.length > 1 ?
                           " Violations Detected" : " Violation Detected");
        vioMessage.details.map((item) => {
            printVios.push (
                <><div key={item} className = "terminus-violation">
                    <b>{item.prop}</b> {item.mval}
                </div></>
            )
        })
    }

    if (isObject(report)){
        switch(report.status){
            case reportAlert.SUCCESS:
                if(isObject(results)){
                   alert = reportAlert.SUCCESS_COLOR
                }
            break;
            case reportAlert.ERROR:
                if(report.error.data && report.error.data['terminus:witnesses']){
                    TerminusViolations(report.error.data['terminus:witnesses'])
                    alert = reportAlert.VIO_COLOR
                }
                else if(report.error.data && Array.isArray(report.error.data)){
                    TerminusViolations(report.error.data);
                    alert = reportAlert.VIO_COLOR
                }
                else{
                    message = String(report.error)
                    alert = reportAlert.ERROR_COLOR
                }
            break;
        }
    }

    return (
        <>
            {/***** success and errors ****/}
            {(isObject(report)) && (alert !== reportAlert.VIO_COLOR) &&
                <span className = "result-reports">
                    <Alert  color = { alert }>
                        <b>{ message }</b>
                    </Alert >
                </span>}

            {/***** vios ****/}
            {(isObject(report)) && (alert == reportAlert.VIO_COLOR) &&
                <span className = "result-reports">
                    <Alert color = { alert }>
                        <b>{ vioMessage.numberOfViolations }</b>
                        {printVios}
                    </Alert >
                </span>}</>
    )
}
