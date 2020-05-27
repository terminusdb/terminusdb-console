import React, { useState, useEffect } from 'react';
import { OWLEditor } from "./OWLEditor";
import Loading from "../../components/Reports/Loading";
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import {FAILED_LOADING_OWL} from "./constants.schema"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { APIUpdateReport } from "../../components/Reports/APIUpdateReport"

export const OWL = (props) => {
    const [edit, setEdit] = useState(false);
    const [filter, setFilter] = useState(props.graph)
    const [empty, setEmpty] = useState()
    const [updateSuccess, setUpdateSuccess] = useState()
    const [error, setError] = useState()
    const [dataProvider, setDataProvider] = useState()
    const {woqlClient} = WOQLClientObj();

    useEffect(() => {
        if(props.graph){
            let id = (props.graph.gid == "*" ? "main" : props.graph.gid) 
            setFilter({type: props.graph.type, id: id})
            woqlClient.getTriples(props.graph.type, id)
            .then((cresults) => {
                setDataProvider(cresults);
                setEmpty(cresults == "") 
            })
            .catch((e) => {
                setError({type: "read", error: e})
            })
        }
    }, [props.graph])

    function updateSchema(contents, commitmsg){
        let ts = Date.now()
        setUpdateSuccess(false)
        woqlClient.updateTriples(filter.type, filter.id, contents, commitmsg)
        .then((cresults) => {
            setEdit(false)
            setDataProvider(contents);
            setEmpty(contents == "") 
            setUpdateSuccess(Date.now() - ts)
        })
        .catch((e) => {
            setError({type: "update", error: e})
        })
    }

    return (
        <div className = "tab-co">
            {(!dataProvider && !error && !empty) &&  
                <Loading type="component"/>
            }
            {(error && error.type == "read") && 
                <ComponentFailure failure={FAILED_LOADING_OWL} error={error} />
            }
            {(error && error.type == "update") &&
                <APIUpdateReport error={error.error} status="error" message="Failed to update triples"/>
            }
            {updateSuccess && 
                <APIUpdateReport status="success" message="Successfully update graph" time={updateSuccess}/>
            }
            { empty && 
                <EmptyResult />
            }
            {(dataProvider || empty) &&  
                <OWLEditor dataProvider = {dataProvider} edit = {edit} onChange = {updateSchema}/>
            }
        </div>
    )
}
