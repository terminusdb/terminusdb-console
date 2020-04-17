import React, { useState, useEffect } from "react";
import { QueryPane } from "./QueryPane";
import TerminusClient from '@terminusdb/terminus-client';
import { useForm } from 'react-hook-form';
import { isObject, isArray } from "../../utils/helperFunctions";
import { WOQL_JS, WOQL_JSON, WOQL_PY } from '../../labels/queryFormats'
import { hooks } from "../../hooks"
import * as q from "../../labels/queryLabels";
import * as view from "../../labels/viewLabels"

export const Preview = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [qp, setQp] = useState(false);
    const [woql, setWOQL] = useState({});
    const WOQL = TerminusClient.WOQL
    const query = WOQL.query().propertyMetadata();
    let dataProvider = {};
    //const [dataProvider, loading] = hooks(woql);
    /*let result = {};
    if(isObject(dataProvider))  result = (dataProvider.results);*/


    const editor = {edit: true,
        submit: true,
        languages: [WOQL_JS, WOQL_JSON],
        library: [q.SHOW_ALL_SCHEMA_ELEMENTS,
                  q.SHOW_ALL_CLASSES,
                  q.SHOW_ALL_PROPERTIES],
        library_autosubmit: false,
        submit: 'Run Query'
    };

    const resultPane = {
        viewEditor: {
            edit: true,
            languages: [WOQL_JS, WOQL_JSON],
            submit: 'Update View'
        },
        view: [view.TABLE_VIEW, view.GRAPH_VIEW]
    }

    const onSubmit = (data) => {
        setQp(true);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit) }>
                <button className = { 'preview '}
                    type =  { 'submit' } >
           			{ 'Get Query Pane' }
               	</button>
            </form>
            {qp && <QueryPane editor = { editor }
                query = { query }
                resultPane = { resultPane }/>}
        </>
    )
}
