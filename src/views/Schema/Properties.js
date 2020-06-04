import React, { useState, useEffect } from 'react';
import Loading from "../../components/Reports/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLQueryContainerHook } from "../../components/Query/WOQLQueryContainerHook"
import { FAILED_LOADING_SCHEMA_CLASSES, PROPERTIES_QUERY_LIMIT, TAB_SCREEN_CSS } from "./constants.schema"
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBContextObj } from "../../components/Query/DBContext"
import { PropertyList } from "../Tables/PropertyList"
import { SCHEMA_PROPERTIES_ROUTE } from '../../constants/routes';
import { SchemaToolbar } from './SchemaToolbar';
import { PROPERTIES_TABLE_INFO_MSG } from "./constants.schema"
import { TERMINUS_INFO } from "../../constants/identifiers"

export const Properties = (props) => {

    const {woqlClient} = WOQLClientObj();
    const {branch, ref} = DBContextObj();
    const [filter, setFilter] = useState(props.graph)
    const [updateQuery, report, bindings, woql, loading] = WOQLQueryContainerHook(woqlClient, getPropertiesQuery(props.graph), branch, ref)

    let initMsg = (PROPERTIES_TABLE_INFO_MSG ? {status: TERMINUS_INFO, message: PROPERTIES_TABLE_INFO_MSG} : null)
    const [reportMessage, setReport] = useState(initMsg)

    useEffect(() => {
        if(props.graph && (!filter || filter.id != props.graph.id || filter.type != props.graph.type )){
            if(filter) updateQuery(getPropertiesQuery(props.graph));
            setFilter(props.graph)
        }
    }, [props.graph])

    function getPropertiesQuery(gfilter){
        let gstr = gfilter.type + "/" + gfilter.id
        return TerminusClient.WOQL.limit(PROPERTIES_QUERY_LIMIT, TerminusClient.WOQL.lib().propertyMetadata(gstr))
    }

    return (
        <div className = {TAB_SCREEN_CSS}>
            <SchemaToolbar page={SCHEMA_PROPERTIES_ROUTE} graph={filter} onChangeGraph={props.onChangeGraph} report={reportMessage} />
            {loading &&
                <Loading type="component"/>
            }
            {(report && report.error) &&
                <ComponentFailure failure={FAILED_LOADING_SCHEMA_CLASSES} error={report.error} />
            }
            {(report && report.rows > 0 && bindings) &&
                <PropertyList query={woql} properties={bindings} updateQuery={updateQuery}/>
            }
            {(report && report.rows == 0) &&
                <EmptyResult report={report} />
            }
        </div>
    )
}
