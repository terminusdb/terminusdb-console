import React, { useState, useEffect } from 'react';
import Select from "react-select";

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
            props.onChange(nub)
        }
    }

    function graphOptions(grs){
        let opts = []
        if(grs.schema.length > 1) opts.push({label: graphLabel("schema/*"), "value": "schema/*"})
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

    function hasSchema(){
        return (graphs && 
            ((graphs.inference && graphs.inference.length > 0 )
            || (graphs.schema && graphs.schema.length > 0)))
    }

    function graphLabel(f){
        if(f.type == "schema" && f.gid == "*") return "All Schema Graphs"
        else if(f.type == "inference" && f.gid == "*") return "All Inference Graphs"
        else {
            if(f.type == "schema") return "Schema Graph " + f.gid
            else return "Inference Graph " + f.gid
        }        
    }

    function filterString(filter){
        return filter.type + "/" + filter.gid
    }

    if(hasSchema() && filter) {
        return (
            <Select placeholder = {"Graph: " + graphLabel(filter)}
                className = "brSeltr"
                value = {filterString(filter)}
                onChange = {changeFilter}
                options = {graphOptions(graphs)}/>
        )
    }
    return null;
}

export default GraphFilter;
