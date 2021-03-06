import React , {useState, useEffect} from 'react';
import {BRANCH_SELECTOR} from "./constants.history"
import { DBContextObj } from "../Query/DBContext"
import {Dropdown} from '../Form/Dropdown';
/**
 * Simple Dropdown for switching between branches
 */
export const BranchSelector = ({ onChange, hideSingle, currentBranch, setTargetBranch }) => {

    hideSingle = false
    let {branches, branch, setHead} = DBContextObj();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [branchTitle, setBranchTitle]=useState(false)

    const toggle = () => setDropdownOpen(prevState => !prevState);

    function changeBranch(SelValue){
        let nub = SelValue
        if(nub !== get_branch()){
            if(onChange){
                onChange(nub)
            }
            else {
                setHead(nub)
            }
        }
        toggle();
    }

    function get_branch(){
        if(currentBranch) return currentBranch
        return branch
    }

    useEffect(() => {
        setBranchTitle(BRANCH_SELECTOR.label + " " + get_branch())
        if(setTargetBranch) setTargetBranch(get_branch())
    }, [branch])



    if(branch && branches && Object.keys(branches).length > 1 ) {
        let bopts = Object.values(branches).map( (item) => {
            return {label: item.id, value: item.id}
        })

        const entries = Object.values(branches).map((item, index) => {
            if(item.id != branch) {
                return (<button onClick={ () => {
                        setBranchTitle(BRANCH_SELECTOR.label + " " + item.id)
                        if(setTargetBranch) setTargetBranch(item.id)
                        changeBranch(item.id)}}
                    className="tdb__dropdown__button" key={item.id} >{item.id}</button>
                )
            }
        })

        return( <Dropdown toggle={toggle} isOpen={dropdownOpen} title={branchTitle} className="nav__main__link" >
                    {entries}
                </Dropdown>
            )
    }else if(branch && branches && Object.keys(branches).length == 1 && !hideSingle){
        return (
                <span className="nav__main__link">
                        {BRANCH_SELECTOR.label + " " + branch}
                </span>
        )
    }
    return (<span className={BRANCH_SELECTOR.emptyBranchClassName}/>)
}

/*

<OutsideClickHandler
                    onOutsideClick={closeDrop}
                >
                    <div className="tdb__dropdown" >
                        <button className="tdb__dropdown__button tdb__dropdown__button--top nav__main__link" onClick={toggle}>
                            {BRANCH_SELECTOR.label + " " + branch} <i className="fa fa-caret-down"></i>
                        </button>
                        <div className={dropdownContent}>
                          {entries}
                        </div>
                    </div>
                </OutsideClickHandler>
            )

<Dropdown  isOpen={dropdownOpen} toggle={toggle} nav inNavbar>
                    <DropdownToggle nav caret>
                        {BRANCH_SELECTOR.label + " " + branch}
                    </DropdownToggle>
                    <DropdownMenu>
                        {entries}
                    </DropdownMenu>
                </Dropdown> */

/*
<div className="dropdown" >
                    <button className="dropdown__button dropdown__button--top nav__main__link" >
                        Dropdown <i className="fa fa-caret-down"></i>
                    </button>
                    <div className={dropdownContent}>
                      <button className="dropdown__button">Link 1</button>
                      <button className="dropdown__button">Link 2</button>
                    </div>
                   </div>*/
