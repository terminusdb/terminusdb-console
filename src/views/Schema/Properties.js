import React, { useState, useEffect } from 'react';
import Loading from "../../components/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLQueryContainerHook } from "../../components/WOQLQueryContainerHook"
import { FAILED_LOADING_SCHEMA_CLASSES } from "./constants"  
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const Properties = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(getPropertiesQuery(props.graph));

    useEffect(() => {
        if(props.graph && (!filter || filter.gid != props.graph.gid || filter.type != props.graph.type )){
            if(filter) updateQuery(getPropertiesQuery(props.graph));
            setFilter(props.graph)
        }
    }, [props.graph, props.rebuild])
    
    function getPropertiesQuery(gfilter){
        let gstr = gfilter.type + "/" + gfilter.gid
        return TerminusClient.WOQL.limit(200, TerminusClient.WOQL.lib().propertyMetadata(gstr))
    }

    return (
        <div className = "tab-co">
            {!report && 
                <Loading />
            }
            {(report && report.error) && 
                <ComponentFailure failure={FAILED_LOADING_SCHEMA_CLASSES} error={report.error} />
            }
            {(report && report.rows > 0) &&   
                <ResultViewer type="table" query={woql} bindings={bindings} />
            }            
            {(report && report.rows == 0) && 
                <EmptyResult report={report} />
            }
        </div>
    )


}
