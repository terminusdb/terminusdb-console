import React, { useState, useEffect } from 'react';
import Select from "react-select";
import {Row, Col} from "reactstrap"
import { GRAPH_FILTER_CSS, ALL_SCHEMA_GRAPHS, ALL_INFERENCE_GRAPHS,  SCHEMA_GRAPH, INFERENCE_GRAPH, GRAPH_FILTER_CONTAINER } from "./constants.schema"

const GraphFilter = (props) => {
    const [filter, setFilter] = useState(props.filter);
    const [graphs, setGraphs] = useState(props.graphs);

    //update state whenever props change
    useEffect(() => {
        setGraphs(props.graphs) 
        setFilter(props.filter) 
    }, [props])

    function changeFilter(SelValue){
        let nub = SelValue.value
        if(nub !=  filterString(filter)){
            let bits = nub.split("/")
            if(props.onChange) props.onChange({type: bits[0], gid: bits[1]})
        }
    }

    function graphOptions(grs){
        let opts = []
        if(grs.schema.length > 1) opts.push({label: graphLabel({type: "schema", gid: "*"}), "value": "schema/*"})
        for(var i = 0; i< grs.schema.length ; i++){
            opts.push({
                label: graphLabel({type: "schema", gid: grs.schema[i]}), value: "schema/" + grs.schema[i] 
            })
        }
        if(grs.inference.length > 1) opts.push({label:  graphLabel({type: "inference", gid: "*"}), "value": "inference/*"})
        for(var i = 0; i< grs.inference.length ; i++){
            opts.push({
                label: graphLabel({type: "inference", gid: grs.inference[i]}), value: "inference/" + grs.inference[i] 
            })
        }
        return opts
    }

    function needsFilter(){
        if(!graphs) return false
        let c = graphs.inference ? graphs.inference.length : 0
        c += graphs.schema ? graphs.schema.length : 0
        return c>1
    }

    function graphLabel(f){
        if(f.type == "schema" && f.gid == "*") return ALL_SCHEMA_GRAPHS
        else if(f.type == "inference" && f.gid == "*") return ALL_INFERENCE_GRAPHS
        else {
            if(f.type == "schema") return `${SCHEMA_GRAPH} ${f.gid}`
            else return `${INFERENCE_GRAPH} ${f.gid}`
        }        
    }

    function filterString(filter){
        return filter.type + "/" + filter.gid
    }

    if(needsFilter() && filter) {
        return (
            <Row>
                <Col md={9} />
                <Col md={3} className={GRAPH_FILTER_CONTAINER} >
                    <Select 
                        placeholder = {graphLabel(filter)}
                        className = {GRAPH_FILTER_CSS}
                        value = {filterString(filter)}
                        onChange = {changeFilter}
                        options = {graphOptions(graphs)}/>
                </Col>
            </Row>
        )
    }
    return null;
}

export default GraphFilter;
