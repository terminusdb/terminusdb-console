import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { format } from "date-fns";


const BranchSelector = (props) => {
    const [branch, setBranch] = useState(props.branch);
    const [branches, setBranches] = useState(props.branches);

    //update state whenever props change
    useEffect(() => {
        setBranches(props.branches) 
        setBranch(props.branch) 
    }, [props])

    function changeBranch(SelValue){
        let nub = SelValue.value
        if(nub != branch){
            props.onChange(nub)
        }
    }

    if(branches && branches.length > 0) {
        return (
          <span>
            <Select placeholder = {"Branch: " + branch}
                className = "brSeltr"
                value = {branch}
                onChange = {changeBranch}
                options = {branches}/>
            {props.created &&
                <span>Created: {format(new Date(props.created * 1000), "dd-MMM-yy HH:mm")}, {props.count} Updates </span>
            }
            </span>
        )
    }
    return null;
}

export default BranchSelector;
