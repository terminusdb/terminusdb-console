import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import Select from "react-select";
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'


export const DocumentTypeFilter = ({doctype, setType, meta, types}) => {
    const [docType, setDocType] = useState(doctype)
    useEffect(() => {
        if(doctype){
            setDocType(doctype)
        }
    }, [doctype])

    function typeOptions(){
        let to = [{value: "", label: "Show All Document Types"}]
        for(var i = 0; i<types.length; i++){
            let lab = (types[i]['Class Name'] && types[i]['Class Name']['@value'] ? types[i]['Class Name']['@value'] : types[i]['Class ID'])
            to.push({label: lab, value: types[i]['Class ID']})
        }
        return to
    }

    function changeFilter(e){
        if(setType) setType(e.value)
    }

    function getTypeSelector(){
        let ph = "Show All " + types.length + " Types"
        if(docType && meta){
            ph = "Show " + meta.label + " Documents"
        }
        else if(docType){
            ph = "Show " + docType + " Documents"
        }
        else if(types.length == 1){
            ph = "1 Document Type"
        }
        return <Select
            placeholder={ph}
            value = {docType}
            onChange = {changeFilter}
            options = {typeOptions()}
        />
    }

    return <span>
        {types && types.length > 0 &&
            <span> {getTypeSelector()} </span>
        }
    </span>
}

export const DocumentSubTypeFilter = ({doctype, setType}) => {
    if(!doctype) return null
    const [types, setTypes] = useState()
    let WOQL = TerminusClient.WOQL
    const {woqlClient} = WOQLClientObj()
    const {ref, branch, prefixes} = DBContextObj()
    const docQuery = () => {
        return WOQL.and(
            WOQL.lib().classes(),
            WOQL.sub(doctype, "v:Class ID")
        )
    }
    const [updateQuery, report, qresult, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        branch,
        ref,
    )

    useEffect( () => {
        if(doctype){
            setTypes()
            updateQuery(docQuery())
        }
    }, [doctype])

    useEffect(() => {
        if(qresult){
            setTypes(qresult.bindings)
        }
    }, [qresult])

    function typeOptions(){
        let to = []
        for(var i = 0; i<types.length; i++){
            if(types[i]['Class ID'] != doctype){
                let lab = (types[i]['Class Name'] && types[i]['Class Name']['@value'] ? types[i]['Class Name']['@value'] : types[i]['Class ID'])
                to.push({label: lab, value: types[i]['Class ID']})
            }
        }
        return to
    }

    function changeFilter(e){
        if(setType) setType(e.value)
    }

    function getTypeSelector(){
        let ph = types.length - 1 + " sub-types"
        return <Select
            placeholder={ph}
            defaultValue = {doctype}
            onChange = {changeFilter}
            options = {typeOptions()}
        />
    }
    if(types && types.length > 2){
        return <span>{getTypeSelector()}</span>
    }
    return null
}
