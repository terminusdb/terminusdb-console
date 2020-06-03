import React from 'react';
import Select from "react-select";
import {BRANCH_SELECTOR} from "./constants.history"

/**
 * Simple Dropdown for switching between branches
 */

export const BranchSelector = ({branch, branches, onChange, hideSingle, className}) => {

    hideSingle = hideSingle || false

    function changeBranch(SelValue){
        let nub = SelValue.value
        if(nub != branch){
            onChange(nub)
        }
    }

    if(branch && branches && branches.length > 0) {
        console.log('branches', branches)
        return (
            <Select placeholder = {BRANCH_SELECTOR.label + " " + branch}
                className = {className || BRANCH_SELECTOR.selectClassName}
                value = {branch}
                onChange = {changeBranch}
                options = {branches}/>
        )
        /*return (
            <WidgetSelector placeholder = {BRANCH_SELECTOR.label + " " + branch}
                className = {className || BRANCH_SELECTOR.selectClassName}
                value = {branch}
                onChange = {changeBranch}
                options = {branches}/>
        )*/
    }
    else if(branch && branches && branches.length == 1 && !hideSingle){
        return (
            <span className={BRANCH_SELECTOR.singleBranchClassName}>
                <label className={BRANCH_SELECTOR.singleBranchLabelClassName}>
                    {BRANCH_SELECTOR.label}
                </label>
                <span className={BRANCH_SELECTOR.branchIDClassName}>
                    {branch}
                </span>
            </span>
        )
    }
    return (<span className={BRANCH_SELECTOR.emptyBranchClassName}/>)
}
