import React, { useState, useEffect } from "react";
import { Alert  } from 'reactstrap';
import { isObject } from "../../utils/helperFunctions"
import * as tag from "../../labels/tags"

export const Report = (props) => {
    const results = props.results || {};
    const report = props.report || {};
    const resultReport = props.resultReport || {};
    let message = false, alert = tag.SUCCESS_COLOR;

    if (isObject(report)){
        switch(report.status){
            case tag.SUCCESS:
                if(isObject(results)){
                    if(results.hasBindings()){
                        message = "Query returned " + results.count() + " results in "
                            + report.processingTime + " seconds";
                    }
                    else if(results.hasUpdates()){
                        message = results.inserts() + " triples inserted, " + results.deletes()
                            + " triples deleted in " + report.processingTime + " seconds";
                    }
                    alert = tag.SUCCESS_COLOR
                }
            break;
            case tag.ERROR:
                if(report.error.data && report.error.data['terminus:witnesses']){
                    console.log(report.error.data['terminus:witnesses']);
                    alert = tag.VIO_COLOR
                }
                else if(report.error.data && Array.isArray(report.error.data)){
                    console.log(report.error.data);
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
        <> {(isObject(report)) && <span className = "result-reports">
            <Alert  color = { alert }>
                <b>{ message }</b>
            </Alert >
        </span>}</>
    )
}
