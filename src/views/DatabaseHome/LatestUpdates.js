import React, { useState, useEffect } from 'react';
import Loading from "../../components/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLQueryContainerHook } from "../../components/WOQLQueryContainerHook"
import { FAILED_LOADING_LATEST_UPDATES } from "./constants"  
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLClientObj } from "../../init/woql-client-instance";

export const LatestUpdates = (props) => {
    const {woqlClient} = WOQLClientObj();
    let query = TerminusClient.WOQL.limit(50).select("v:Time", "v:Author", "v:Message").order_by("v:Time", 
        TerminusClient.WOQL.lib().loadCommitDetails(woqlClient, "v:B"))
    
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(query);

    return (
        <div className = "tab-co">
            {!report && 
                <Loading />
            }
            {(report && report.error) && 
                <ComponentFailure failure={FAILED_LOADING_LATEST_UPDATES} error={report.error} />
            }
            {(report && report.rows > 0 && bindings) &&   
                <ResultViewer type="table" query={woql} bindings={bindings} />
            }            
            {(report && report.rows == 0) && 
                <EmptyResult report={report} />
            }
        </div>
    )
}