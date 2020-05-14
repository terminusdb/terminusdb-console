import React, { useState, useEffect } from 'react';
import { RenderSnippet } from "../../components/RenderSnippet";
import Loading from "../../components/Loading";
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import {FAILED_LOADING_OWL} from "./constants"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { EmptyResult } from "../../components/Reports/EmptyResult"
import { APIUpdateReport } from "../../components/Reports/ViolationReport"

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
            setFilter(props.graph)
            woqlClient.getTriples(props.graph.type, props.graph.gid)
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
        let ts = Date().now()
        setUpdateSuccess(false)
        woqlClient.updateTriples(filter.type, filter.gid, contents, commitmsg)
        .then((cresults) => {
            setEdit(false)
            setDataProvider(contents);
            setEmpty(contents == "") 
            setUpdateSuccess(Date().now() - ts)
        })
        .catch((e) => {
            setError({type: "update", error: e})
        })
    }

    return (
        <div className = "tab-co">
            {(!dataProvider && !error && !empty) &&  
                <Loading />
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
                <RenderSnippet dataProvider = {dataProvider}
                    edit = {edit} onChange = {updateSchema}/>
            }
        </div>
    )
}
