import React, { useState } from "react";
import {EDIT_THIS_VERSION, LANGUAGE_NAMES, LANGUAGE_DROPDOWN, TOOLBAR_CSS} from './constants.querypane'

export const LanguageSwitcher = ({active, baseLanguage, showLanguage, languages, editable, onChange, onEdit}) => {
    if(!languages) return null

    const currentLanguage=showLanguage || baseLanguage;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const showedit = (editable && showLanguage && ["js", "json"].indexOf(showLanguage) !== -1)
    const setEditLanguage = () => {onEdit(currentLanguage)}

    const disabled = active=== true ? true : false;

    const dropdownContent = dropdownOpen===true ? "tdb__dropdown__content  tdb__dropdown__content--show" : "tdb__dropdown__content  tdb__dropdown__content--hide"
    const buttonClass=showedit===true ? "tdb__button__base tdb__commit__bar--button" : "tdb__button__base tdb__commit__bar--button tdb__commit__bar__vis--hidden"
    const changeLanguage = (lang) =>{
        toggle()
        onChange(lang)
    }

    let currentLabel='';
    const entries = languages.map((lang, index) => {
        let langname = LANGUAGE_NAMES[lang]
        let active= {}
        if(lang===currentLanguage){
            active={active:true}
            currentLabel=`${langname} `;
        }

        return(<button onClick={function(){changeLanguage(lang)}} {...active}
                    className="tdb__dropdown__button" key={lang} > {langname}</button>
                    )})

    return (
        <>       
         <button className={buttonClass} onClick={setEditLanguage}>{EDIT_THIS_VERSION}
         </button>
         <div className="tdb__dropdown" >
            <button className="tdb__dropdown__button tdb__commit__bar--drop" onClick={toggle}>
                {currentLabel } <i className="fa fa-caret-down"></i>
            </button>
            <div className={dropdownContent}>
              {entries}
            </div>
        </div>
        </>
    )
}

/*
  <Dropdown  isOpen={dropdownOpen} toggle={toggle} className = { TOOLBAR_CSS.dropdown }>
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
}*/

//{showedit  && <Button onClick={setEditLanguage}>{EDIT_THIS_VERSION}</Button>}
