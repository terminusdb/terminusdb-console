import React from 'react';
import Select from "react-select";
import {BRANCH_SELECTOR} from "./constants.history"
import { DBContextObj } from "../Query/DBContext"

/**
 * Simple Dropdown for switching between branches
 */

export const BranchSelector = ({ onChange, hideSingle, className }) => {

    hideSingle = hideSingle || true

    const {branches, branch, setHead} = DBContextObj();


    function changeBranch(SelValue){
        let nub = SelValue.value
        if(nub != branch){
            setHead(nub)
        }
    }


    if(branch && branches) {
        let bopts = Object.values(branches).map( (item) => {
            return {label: item.id, value: item.id}
        })
        return (
        <Select placeholder = {BRANCH_SELECTOR.label + " " + branch}
            className = {className || BRANCH_SELECTOR.selectClassName}
            defaultValue = {branch}
            onChange = {changeBranch}
            options = {bopts}/>
        )
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
