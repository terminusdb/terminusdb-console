import React, { useState, useEffect } from 'react';
import Select from "react-select";

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
        <Select placeholder = {"Branch: " + branch}
                className = "brSeltr"
                value = {branch}
                onChange = {changeBranch}
                options = {branches}/>
        );
    }
  return null;
}

export default BranchSelector;
