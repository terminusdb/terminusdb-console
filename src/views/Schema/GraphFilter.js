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

    function graphOptions(garr){
        let opts = []
        for(var i = 0; i< graphs.schema.length ; i++){

        }
    }

    function hasSchema(){
        return (graphs && 
            ((graphs.inference && graphs.inference.length > 0 )
            || (graphs.schema && graphs.schema.length > 0)))
    }

    function graphLabel(f){
        
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
