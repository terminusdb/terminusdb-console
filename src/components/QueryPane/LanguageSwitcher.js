import React, { useState, useEffect } from "react";
import {EDIT_THIS_VERSION, LANGUAGE_NAMES, LANGUAGE_DROPDOWN} from './constants'
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";

export const LanguageSwitcher = ({active, baseLanguage, showLanguage, languages, editable, onChange, onEdit}) => {
    if(!languages) return null

    const currentLanguage=showLanguage || baseLanguage;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);


    const showedit = (editable && showLanguage && ["js", "json"].indexOf(showLanguage) != -1) 
    const setEditLanguage = () => {onEdit(currentLanguage)}

    const disabled = active=== true ? true : false;

    let currentLabel='';
    const entries = languages.map((lang, index) => {
        let langname = LANGUAGE_NAMES[lang]
        let active= {}
        if(lang===currentLanguage){
            active={active:true}
            currentLabel=langname;
        }
              
        return (<DropdownItem 
                    key={lang} 
                    //disabled={disabled} 
                    {...active}
                    onClick={function(){onChange(lang)}}>
                    {langname}</DropdownItem>) 
    })
    
   //origin disabled={disabled}
    return (
        <>
        {showedit && <Button onClick={setEditLanguage}>{EDIT_THIS_VERSION}</Button>}
        <Dropdown  isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                {currentLabel}
            </DropdownToggle>
            <DropdownMenu>
                {entries}
            </DropdownMenu>
        </Dropdown>       
        </>
    )
}