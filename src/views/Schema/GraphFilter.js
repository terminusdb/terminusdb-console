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
        if(nub != filter){
            props.onChange(nub)
        }
    }

    function graphOptions(garr){

    }

    function graphLabel(garr){
        
    }




    if(branches && branches.length > 0) {
        return (
            <Select placeholder = {"Branch: " + graphLabel(filter)}
                className = "brSeltr"
                value = {filterString(filter)}
                onChange = {changeFilter}
                options = {graphOptions(graphs)}/>
        )
    }
    return null;
}

export default GraphFilter;
