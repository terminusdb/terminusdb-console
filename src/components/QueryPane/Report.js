import React, { useState, useEffect } from "react";
import { isObject } from "../../utils/helperFunctions"
import * as tag from "../../labels/tags"

export const Report = (props) => {
    const results = props.results || {};
    const report = props.report || {};
    const resultReport = props.resultReport || {};
    let message = false;

    if (isObject(report)){
        switch(report.status){
            case tag.SUCCESS:
                if(results.hasBindings()){
                    message = "Query returned " + results.count() + " results in "
                        + report.processingTime + " seconds";
                }
                else if(results.hasUpdates()){
                    message = results.inserts() + " triples inserted, " + results.deletes()
                        + " triples deleted in " + report.processingTime + " seconds";
                }
            break;
            case tag.ERROR:
                if(report.error.data && report.error.data['terminus:witnesses']){
                    console.log(report.error.data['terminus:witnesses']);
                }
                else if(report.error.data && Array.isArray(report.error.data)){
                    console.log(report.error.data);
                }
                else message = report.error
            break;
        }
    }

    return (
        <> {(isObject(report)) && <span className = "result-reports">
            { message }
        </span>}</>
    )
}
