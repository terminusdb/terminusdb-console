import React, { useState, useEffect } from 'react';
import Loading from "../../components/Reports/Loading";
import TerminusClient from '@terminusdb/terminusdb-client';
import { WOQLQueryContainerHook } from "../../components/Query/WOQLQueryContainerHook"
import { FAILED_LOADING_SCHEMA_CLASSES, CLASSES_QUERY_LIMIT, TAB_SCREEN_CSS } from "./constants.schema"
import { TERMINUS_COMPONENT, TERMINUS_INFO } from "../../constants/identifiers"
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBContextObj } from "../../components/Query/DBContext"
import { ClassList } from "../Tables/ClassList"
import { SchemaToolbar } from './SchemaToolbar';
import { SCHEMA_CLASSES_ROUTE } from '../../constants/routes';
import { CLASS_TABLE_INFO_MSG } from "./constants.schema"


export const Classes = (props) => {

    const {woqlClient} = WOQLClientObj();
    const {ref, branch, graphs} = DBContextObj();

    const [filter, setFilter] = useState(props.graph)
    const [updateQuery, report, bindings, woql, loading] = WOQLQueryContainerHook(woqlClient, getClassQuery(props.graph), branch, ref)

    let initMsg = (CLASS_TABLE_INFO_MSG ? {status: TERMINUS_INFO, message: CLASS_TABLE_INFO_MSG} : null)
    const [reportMessage, setReport] = useState(initMsg)

    useEffect(() => {
        if(props.graph && (!filter || filter.id != props.graph.id || filter.type != props.graph.type )){
            if(filter) updateQuery(getClassQuery(props.graph));
            setFilter(props.graph)
        }
    }, [props.graph])

    function getClassQuery(gfilter){
        let gstr = gfilter.type + "/" + gfilter.id
        return TerminusClient.WOQL.limit(CLASSES_QUERY_LIMIT, TerminusClient.WOQL.lib().classes(null, null, gstr))
    }

    return (
        <div className = {TAB_SCREEN_CSS}>
            <SchemaToolbar page={SCHEMA_CLASSES_ROUTE} graph={filter} onChangeGraph={props.onChangeGraph} report={reportMessage} />
            {loading &&
                <Loading type={TERMINUS_COMPONENT}/>
            }
            {(report && report.error) &&
                <ComponentFailure failure={FAILED_LOADING_SCHEMA_CLASSES} error={report.error} />
            }
            {(report && report.rows > 0 && bindings) &&
                <ClassList query={woql} classes={bindings} updateQuery={updateQuery}/>
            }
            {(report && report.rows == 0) &&
                <EmptyResult report={report} />
            }
        </div>
    )
}
