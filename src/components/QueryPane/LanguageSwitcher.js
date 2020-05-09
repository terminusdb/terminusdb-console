import React, { useState } from "react";
import {EDIT_THIS_VERSION, LANGUAGE_NAMES, LANGUAGE_DROPDOWN} from './constants'
import { Button, ButtonGroup, Dropdown, DropdownMenu, DropdownToggle, Badge} from "reactstrap";


export const LanguageSwitcher = ({active, language, showLanguage, languages, editable, onChange, onEdit, type}) => {
    if(!languages) return null
    let nlanguages = [];
    nlanguages.push({id: "original", badge: getLanguageBadge(language, "base")})
    for(var i = 0; i<languages.length; i++){
        //if language is editable and editale put it in here....
        //also put it in here if it is selected...
        let selected = (showLanguage && languages[i].id == showLanguage || (!showLanguage && languages[i].id == "original"))
        nlanguages.push({id: languages[i], selected:selected, badge: getLanguageBadge(languages[i])})
    }
    const showedit = (editable && showLanguage && ["js", "json"].indexOf(showLanguage) != -1) 
    editLang = (showedit ? function() {onEdit(showLanguage)} : false)
    if(type && type == "dropdown"){
        return (<DropDownLanguageSwitcher onEdit={editLang} disabled={!active} languages={nlanguages} onChange={onChange} />)
    }
    return (<ButtonLanguageSwitcher onEdit={editLang} disabled={!active} languages={nlanguages}  onChange={onChange}/>)
}

function getLanguageBadge(lang, base){
    let langname = LANGUAGE_NAMES[lang] || lang
    let color = base ? "primary" : "secondary"
    return (<Badge color={color} pill>{langname}</Badge>)
}

/**
 * Outputs the language switcher as a button toolbar
 */
const ButtonLanguageSwitcher = ({disabled, languages, onChange, onEdit}) => {
    const entries = languages.map((lang) => {
        function processClick(){
            onChange(lang.id)
        }
        return (<Button active={lang.selected} disabled={disabled} onClick={processClick}>{lang.badge}</Button>)         
    })
    return(
        <ButtonToolbar>
            <ButtonGroup> 
                { entries } 
            </ButtonGroup>
        {onEdit && 
            <ButtonGroup> 
                <Button onClick={onEdit}>{EDIT_THIS_VERSION}</Button> 
            </ButtonGroup>
        }
        </ButtonToolbar>
    )
}

/**
 * Outputs the language switcher as a dropdown toolbar
 */
const DropDownLanguageSwitcher = ({disabled, languages, onChange, onEdit}) => {
    //button has disabled, active...
    const entries = languages.map((lang) => {
        return (<DropdownItem active={lang.selected} disabled={disabled} onClick={onChange}>{lang.badge}</DropdownItem>) 
    })

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
  
    return (
    <Container>
        <Dropdown disabled={disabled} isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                {LANGUAGE_DROPDOWN}
            </DropdownToggle>
            <DropdownMenu>
                {entries}
            </DropdownMenu>
        </Dropdown>
        {onEdit && 
            <ButtonGroup> 
                <Button onClick={onEdit}>{EDIT_THIS_VERSION}</Button> 
            </ButtonGroup>
        }
    </Container>
    )
}