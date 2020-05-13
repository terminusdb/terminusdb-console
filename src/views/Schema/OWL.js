import React, { useState, useEffect } from 'react';
import { RenderSnippet } from "../../components/RenderSnippet";
import Loading from "../../components/Loading";
import { ComponentFailure } from "../../components/Reports/ComponentFailure.js"
import { ViolationReport } from "../../components/Reports/ViolationReport.js"
import {FAILED_LOADING_OWL} from "./constants"
import { WOQLClientObj } from "../../init/woql-client-instance";
export const OWL = (props) => {
    const [edit, setEdit] = useState(false);
    const [filter, setFilter] = useState(props.graph)
    const [error, setError] = useState()
    const [dataProvider, setDataProvider] = useState()
    const {woqlClient} = WOQLClientObj();

    useEffect(() => {
        if(props.graph){
            setFilter(props.graph)
            woqlClient.getTriples(props.graph.type, props.graph.gid)
            .then((cresults) => {
                setDataProvider(cresults);
            })
            .catch((e) => {
                setError({type: "read", error: e})
            })
        }
    }, [props.graph])

    function updateSchema(contents, commitmsg){
        woqlClient.updateTriples(filter.type, filter.gid, contents, commitmsg)
        .then((cresults) => {
            setEdit(false)
            setDataProvider(contents);
        })
        .catch((e) => {
            setError({type: "update", error: e})
        })
    }

    return (
        <div className = "tab-co">
            {(!dataProvider && !error) &&  
                <Loading />
            }
            {(error && error.type == "read") && 
                <ComponentFailure failure={FAILED_LOADING_OWL} error={error} />
            }
            {(error && error.type == "update") &&
                <ViolationReport />
            }
            {dataProvider &&  
                <RenderSnippet dataProvider = {dataProvider}
                    edit = {edit} onChange = {updateSchema}/>
            }
        </div>
    )
}
