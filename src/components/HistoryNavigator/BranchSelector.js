import React, { useState, useEffect } from 'react';
import Select from "react-select";
import {printts} from "../../utils/dateFormats"


const BranchSelector = () => {
    const [branchInfo, setBranchInfo] = useState(props.branch);
    const [branches, setBranches] = useState(props.branches);

    //update state whenever props change
    useEffect(() => {
        setBranches(props.branches) 
        setBranchInfo(props.branch) 
    }, [props])

    function changeBranch(SelValue){
        let nub = SelValue.value
        if(nub != branchInfo.id){
            props.onChange(nub)
        }
    }

    if(branches && branches.length > 0) {
        return (
          <span>
            <Select placeholder = {"Branch: " + branchInfo.id}
                className = "brSeltr"
                value = {branchInfo.id}
                onChange = {changeBranch}
                options = {branches}/>
            {props.branch.first &&
                <span>Created: {printts(props.branch.first)}, {props.branch.count} Updates </span>
            }
            </span>
        )
    }
    return null;
}

export default BranchSelector;
