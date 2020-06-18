import React , {useState} from 'react';
import {BRANCH_SELECTOR} from "./constants.history"
import { DBContextObj } from "../Query/DBContext"
import {Dropdown} from '../Form/Dropdown';
/**
 * Simple Dropdown for switching between branches
 */
export const BranchSelector = ({ onChange, hideSingle, className }) => {

    hideSingle = false
    const {branches, branch, setHead} = DBContextObj();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    function changeBranch(SelValue){       
        let nub = SelValue
        if(nub !== branch){
            setHead(nub)
        } 
        toggle();     
    }


    if(branch && branches && Object.keys(branches).length > 1 ) {
        let bopts = Object.values(branches).map( (item) => {
            return {label: item.id, value: item.id}
        })

        const entries = Object.values(branches).map((item, index) => {              
            return (<button onClick={function(){changeBranch(item.id)}} 
                        className="tdb__dropdown__button" key={item.id} >{item.id}</button>
                      
                )
        })

        return( <Dropdown toggle={toggle} isOpen={dropdownOpen} title={BRANCH_SELECTOR.label + " " + branch} className="nav__main__link" >                   
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
