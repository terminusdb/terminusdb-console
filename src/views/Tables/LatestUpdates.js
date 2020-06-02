import React, { useState, useEffect } from 'react';
import Loading from "../../components/Reports/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLQueryContainerHook } from "../../components/Query/WOQLQueryContainerHook"
import { FAILED_LOADING_LATEST_UPDATES } from "../DBHome/constants.dbhome"
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLClientObj } from "../../init/woql-client-instance";

export const LatestUpdates = (props) => {
    const {woqlClient} = WOQLClientObj();
    let query = TerminusClient.WOQL.limit(50).select("v:Time", "v:Author", "v:Message").order_by("v:Time",
        TerminusClient.WOQL.lib().loadCommitDetails(woqlClient, "v:B"))

    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(WOQLClientObj,query);

    return (
        <div className = "tab-co">
            {!report &&
                <Loading type="component"/>
            }
            {(report && report.error) &&
                <ComponentFailure failure={FAILED_LOADING_LATEST_UPDATES} error={report.error} />
            }
            {(report && report.rows > 0 && bindings) && <>
                <hr className="my-space-2"/>
                <hr className="my-space-25"/>
                <p><b>Recent Updates</b></p>
                <hr className="my-space-25"/>
                <ResultViewer type="table" query={woql} bindings={bindings} />
                </>
            }
        </div>
    )
}
