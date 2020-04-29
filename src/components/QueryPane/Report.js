import React, { useState, useEffect } from "react";
import { Alert  } from 'reactstrap';
import { isObject } from "../../utils/helperFunctions"
import * as tag from "../../labels/tags"

export const Report = (props) => {
    const results = props.results || {};
    const report = props.report || {};
    const resultReport = props.resultReport || {};
    let message = false, alert = tag.SUCCESS_COLOR;
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
                <><div className = "terminus-violation">
                    <b>{item.prop}</b> {item.mval}
                </div></>
            )
        })
    }

    if (isObject(report)){
        switch(report.status){
            case tag.SUCCESS:
                if(isObject(results)){
                    if(results.hasBindings()){
                        message = "Query returned " + results.count()
                            + " results in " + report.processingTime + " seconds";
                    }
                    else if(results.hasUpdates()){
                        message = results.inserts() + " triples inserted, "
                            + results.deletes() + " triples deleted in "
                            + report.processingTime + " seconds";
                    }
                    alert = tag.SUCCESS_COLOR
                }
            break;
            case tag.ERROR:
                if(report.error.data && report.error.data['terminus:witnesses']){
                    TerminusViolations(report.error.data['terminus:witnesses'])
                    alert = tag.VIO_COLOR
                }
                else if(report.error.data && Array.isArray(report.error.data)){
                    TerminusViolations(report.error.data);
                    alert = tag.VIO_COLOR
                }
                else{
                    message = String(report.error)
                    alert = tag.ERROR_COLOR
                }
            break;
        }
    }

    return (
        <>
            {/***** success and errors ****/}
            {(isObject(report)) && (alert !== tag.VIO_COLOR) &&
                <span className = "result-reports">
                    <Alert  color = { alert }>
                        <b>{ message }</b>
                    </Alert >
                </span>}

            {/***** vios ****/}
            {(isObject(report)) && (alert == tag.VIO_COLOR) &&
                <span className = "result-reports">
                    <Alert  color = { alert }>
                        <b>{ vioMessage.numberOfViolations }</b>
                        {printVios}
                    </Alert >
                </span>}</>
    )
}
