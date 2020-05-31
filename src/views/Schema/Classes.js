import React, { useState, useEffect } from 'react';
import Loading from "../../components/Reports/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLQueryContainerHook } from "../../components/Query/WOQLQueryContainerHook"
import { FAILED_LOADING_SCHEMA_CLASSES, CLASSES_QUERY_LIMIT } from "./constants.schema"  
import { TERMINUS_COMPONENT } from "../../constants/identifiers"
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLClientObj } from "../../init/woql-client-instance";

export const Classes = (props) => {
    const {woqlClient} = WOQLClientObj();

    const [filter, setFilter] = useState(props.graph)
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(woqlClient,getClassQuery(props.graph));

    useEffect(() => {
        if(props.graph && (!filter || filter.gid != props.graph.gid || filter.type != props.graph.type )){
            if(filter) updateQuery(getClassQuery(props.graph));
            setFilter(props.graph)
        }
    }, [props.graph, props.rebuild])
    
    function getClassQuery(gfilter){
        let gstr = gfilter.type + "/" + gfilter.gid
        return TerminusClient.WOQL.limit(CLASSES_QUERY_LIMIT, TerminusClient.WOQL.lib().classList(gstr))
    }

    return (
        <div className = "tab-co">
            {!report && 
                <Loading type="component"/>
            }
            {(report && report.error) && 
                <ComponentFailure failure={FAILED_LOADING_SCHEMA_CLASSES} error={report.error} />
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
