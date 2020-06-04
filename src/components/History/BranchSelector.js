import React , {useState} from 'react';
import Select from "react-select";
import {BRANCH_SELECTOR} from "./constants.history"
import { DBContextObj } from "../Query/DBContext"
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";

/**
 * Simple Dropdown for switching between branches
 */

export const BranchSelector = ({ onChange, hideSingle, className }) => {

    hideSingle = hideSingle || true

    const {branches, branch, setHead} = DBContextObj();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    function changeBranch(SelValue){
        let nub = SelValue
        if(nub !== branch){
            setHead(nub)
        }
    }


    if(branch && branches) {
        let bopts = Object.values(branches).map( (item) => {
            return {label: item.id, value: item.id}
        })

        const entries = Object.values(branches).map((item, index) => {              
        return (<DropdownItem 
                    key={item.id} 
                    //disabled={disabled} 
                    onClick={function(){changeBranch(item.id)}}>
                    {item.id}</DropdownItem>) 
        })

        return(<Dropdown  isOpen={dropdownOpen} toggle={toggle} nav inNavbar>
                    <DropdownToggle nav caret>
                        {BRANCH_SELECTOR.label + " " + branch}
                    </DropdownToggle>
                    <DropdownMenu>
                        {entries}
                    </DropdownMenu>
                </Dropdown> 
            )
        /*return (
        <Select placeholder = {BRANCH_SELECTOR.label + " " + branch}
            className = {className || BRANCH_SELECTOR.selectClassName}
            defaultValue = {branch}
            onChange = {changeBranch}
            options = {bopts}/>
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
