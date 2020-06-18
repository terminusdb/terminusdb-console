import React, { useState } from "react";
import {EDIT_THIS_VERSION, LANGUAGE_NAMES, LANGUAGE_DROPDOWN, TOOLBAR_CSS} from './constants.querypane'
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row} from "reactstrap";

export const LanguageSwitcher = ({active, baseLanguage, showLanguage, languages, editable, onChange, onEdit}) => {
    if(!languages) return null

    const currentLanguage=showLanguage || baseLanguage;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const showedit = (editable && showLanguage && ["js", "json"].indexOf(showLanguage) !== -1)
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
        <Row>
        {showedit  && <Button className={TOOLBAR_CSS.edit} onClick={setEditLanguage}>{EDIT_THIS_VERSION}</Button>}
        <Dropdown  isOpen={dropdownOpen} toggle={toggle} className = { TOOLBAR_CSS.dropdown }>
            <DropdownToggle caret>
                {currentLabel}
            </DropdownToggle>
            <DropdownMenu>
                {entries}
            </DropdownMenu>
        </Dropdown>
        </Row>
    )
}

//{showedit  && <Button onClick={setEditLanguage}>{EDIT_THIS_VERSION}</Button>}
