import React, { useState, useEffect } from 'react';
import Select from "react-select";
import {printts} from "../../utils/dateFormats"


const BranchSelector = ({branch, branches, onChange}) => {
    const [branchInfo, setBranchInfo] = useState(branch);
    const [sbranches, setBranches] = useState(sbranches);

    //update state whenever props change
    useEffect(() => {
        setBranches(branches) 
        setBranchInfo(branch) 
    }, [branch, branches])

    function changeBranch(SelValue){
        let nub = SelValue.value
        if(nub != branchInfo.id){
            onChange(nub)
        }
    }

    if(sbranches && sbranches.length > 0) {
        return (
          <span>
            <Select placeholder = {"Branch: " + branchInfo.id}
                className = "brSeltr"
                value = {branchInfo.id}
                onChange = {changeBranch}
                options = {sbranches}/>
            {branch.first &&
                <span>Created: {printts(branchInfo.first)}, {branchInfo.count} Updates </span>
            }
            </span>
        )
    }
    return null;
}

export default BranchSelector;
