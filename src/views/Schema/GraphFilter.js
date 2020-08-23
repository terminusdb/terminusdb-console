import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { GRAPH_FILTER_CSS, ALL_SCHEMA_GRAPHS, ALL_INFERENCE_GRAPHS,  INSTANCE_GRAPH, SCHEMA_GRAPH, INFERENCE_GRAPH } from "./constants.schema"
import { DBContextObj } from "../../components/Query/DBContext"
import { SCHEMA_OWL_ROUTE } from '../../constants/routes';

export const GraphFilter = (page, graph, onChange ) => {
    const [filter, setFilter] = useState(graph);
    const { graphs } = DBContextObj();

    const addAlls = (page && page == SCHEMA_OWL_ROUTE ? false : true)

    //update state whenever props change
    useEffect(() => {
        if(graph) setFilter(graph) 
    }, [page, graph])

    function changeFilter(SelValue){
        let nub = SelValue.value
        if(nub !=  filterString(filter)){
            let bits = nub.split("/")
            if(onChange) onChange({type: bits[0], id: bits[1]})
        }
    }

    function graphOptions(grs){
        let insts = []
        let schemas = []
        let infs = []
        for(var key in grs){
            if(grs[key].type == "schema" ) schemas.push(grs[key])
            if(grs[key].type == "inference" ) infs.push(grs[key])
            if(grs[key].type == "instance" ) insts.push(grs[key])
        }
        if(addAlls){        
            if(schemas.length > 1) schemas.unshift({type: "schema", id: "*"})
            if(infs.length > 1) schemas.unshift({type: "schema", id: "*"})
        }
        let choices = schemas.concat(infs)
        if(filter && filter.type == "inference"){
            choices = infs.concat(schemas)
        }
        if(page == SCHEMA_OWL_ROUTE){
            choices = insts.concat(choices)
        } 
        let opts = choices.map((item) => {
            let lab = graphLabel(item)
            return { label: lab, value: filterString(item) }
        })
        return opts
    }

    function graphLabel(f){
        if(f.type == "schema" && f.id == "*") return ALL_SCHEMA_GRAPHS
        else if(f.type == "inference" && f.id == "*") return ALL_INFERENCE_GRAPHS
        else {
            if(f.type == "schema") return `${SCHEMA_GRAPH} ${f.id}`
            else if(f.type == "inference") return `${INFERENCE_GRAPH} ${f.id}`
            else return `${INSTANCE_GRAPH} ${f.id}`
        }        
    }

    function filterString(filter){
        return filter.type + "/" + filter.id
    }

    let opts = graphOptions(graphs)

    if(opts && opts.length > 1 && filter) {
        return (
            <Select 
                placeholder = {graphLabel(filter)}
                className = {GRAPH_FILTER_CSS}
                defaultValue = {filterString(filter)}
                onChange = {changeFilter}
                options = {graphOptions(graphs)}
            />
        )
    }
    return null;
}

