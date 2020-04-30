import React, { useState, useEffect } from 'react';
import { editSchema } from "../../variables/formLabels"
import { RENDER_TYPE_SNIPPET } from "../../labels/renderTypeLabels";
import { RenderSnippet } from "../../components/RenderSnippet";
import { isObject } from "../../utils/helperFunctions";
import Loading from "../../components/Loading";
import { WOQLClientObj } from "../../init/woql-client-instance";

export const OWL = (props) => {
    const [edit, setEdit] = useState(false);
    const [filter, setFilter] = useState(props.graph)
    const [errors, setErrors] = useState()
    const [dataProvider, setDataProvider] = useState()
   
    const {woqlClient} = WOQLClientObj();

    useEffect(() => {
        if(props.graph && (!filter || filter.gid != props.graph.gid || filter.type != props.graph.type ))
        setFilter(props.graph)
    }, [props.graph])

    useEffect(() => {
        if(filter){
            woqlClient.getTriples(filter.type, filter.gid)
            .then((cresults) => {
                setDataProvider(cresults);            
            })
            .catch((e) => {
                //alert(e)
            })
        }
    }, [props.graph, props.rebuild]);

    function updateSchema(contents, commitmsg){
        woqlClient.updateTriples(filter.type, filter.gid, contents, commitmsg)
        .then((cresults) => {
            setEdit(false)
            setDataProvider(contents);            
        })
        .catch((e) => {
            setErrors(e)
        })
    }

    if(!dataProvider) return null
    return (
        <>
            {dataProvider &&
                <RenderSnippet dataProvider = {dataProvider}
                    edit = {edit} onChange = {updateSchema} errors={errors}/>         
            }
            {!dataProvider && <div/>}
        </>
    )
}
