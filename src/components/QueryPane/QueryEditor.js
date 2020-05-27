import React, { useState, useEffect } from "react"
import {DropdownToggle, Container, Button, Alert, Navbar , Collapse, Nav, UncontrolledDropdown,DropdownMenu,DropdownItem, NavbarText} from 'reactstrap'
import { CodeEditor, CodeViewer } from './Editor'
import TerminusClient from '@terminusdb/terminusdb-client';
import {QUERY_SUBMIT, HIDE_QUERY_EDITOR, SHOW_QUERY_EDITOR} from './constants.querypane'
import {LanguageSwitcher} from "./LanguageSwitcher"
import { COMMIT_BOX, QUERY_EDITOR_LABEL  } from "./constants.querypane"

/**
 * Controls the display of query viewer and editor
 */
export const QueryEditor = ({query, baseLanguage, setBaseLanguage, content, saveContent,showLanguage, showContent, setShowContent, setShowLanguage,languages, editable, children, className, submit,updateQuery}) => {
    const qeclass = className || 'terminus-query-editor'
    editable = typeof editable != "undefined" ? editable : true 
    submit = submit || QUERY_SUBMIT
     
    //const [content, setContent] = useState(initcontent);
    /*
    * if is edit mode and the query is an update query
    */
    const [containsUpdate, setContainsUpdate] = useState(false);

    const [error, setError] = useState(false);

    const [commitMsg, setCommitMsg] = useState();

    function onBlur(value){
        //const value=editor.doc.getValue();
        saveContent(value);
        return checkContent()
    }


    /*
    * onBlur
    */
    function checkContent(){        
        //sets errors internally if doesn't work       
        setError(false)
        if(content){
            let woql = makeWOQLFromString(content, baseLanguage)
            if(woql) {
                /*
                * check if the query is an update query and need a commitSMS
                */
                setContainsUpdate(woql.containsUpdate())
            }
            return woql
        }
        return false
    }    

    function sendQuery(){
        let woql = checkContent()
        if(woql){
            if(updateQuery) updateQuery(woql, commitMsg)
        }
    }

    //let currentCont=''

    /*function updateContent(cont){
        //setContent(cont)
        //currentCont=cont;
        setError(false)
    }*/

    /*
    * change the current editable language
    */
    function newLanguageVersion(lang){
        let woql = makeWOQLFromString(content, baseLanguage)
        setBaseLanguage(lang)
        setShowLanguage(false)
        if(woql) setContent(makeWOQLIntoString(woql, lang))
    }

    /*
    * the current language visualized 
    */
    function showLanguageVersion(lang){
        if(lang == baseLanguage){
            setShowLanguage(false)
            setShowContent("")            
        }else {
            let woql = makeWOQLFromString(content, baseLanguage)
            if(woql){
                setShowLanguage(lang)
                setShowContent(makeWOQLIntoString(woql, lang))    
            }
        }
    }


    function makeWOQLFromString(str, lang){
        if(lang === "json"){
            try {
                let myj = JSON.parse(str)
                return new TerminusClient.WOQL.json(myj)
            }catch(e){
                setError(e)
            }
        }
        if(lang === "js"){
            let WOQL = TerminusClient.WOQL
            try {
                var nw = eval(str)
                return nw
            }
            catch(e){
                setError(e)
            }
        }
        else if(lang == "python"){
            setError({message: "Python is not supported for editing queries through the console"})
        }
    }

    function makeWOQLIntoString(woql, lang){
        if(lang === "js" || lang === "python" && woql){
            return woql.prettyPrint(lang)
        }
        else if(lang === "json" && woql){
            return JSON.stringify(woql.json(), undefined, 2);
        }
        else return ""
    }

    if(editable && error) console.log(error)
    return(<Container className={qeclass} >
        <div style={{display: "flex", justifyContent:"flex-end"}}>
            {languages && 
                <LanguageSwitcher 
                    active={!error}
                    baseLanguage={baseLanguage} 
                    showLanguage={showLanguage} 
                    languages={languages} 
                    editable="true" 
                    onChange={showLanguageVersion} 
                    onEdit={newLanguageVersion} 
                />
            }           
           {editable &&  <Button color = "primary" onClick={sendQuery}>{submit}</Button>}
        </div>

        {(!showLanguage && editable) && 
            <CodeEditor  onBlur={onBlur} text={content} language={baseLanguage}/>
        }

        {!editable && !showLanguage &&  
            <CodeViewer text={content} language={baseLanguage}/>
        }

        {showLanguage && 
            <CodeViewer text={showContent} language={showLanguage}/>
        }

        {children}
       
        {(editable) && 
            <textarea onChange={(editor, data, value) => {setCommitMsg(editor.target.value)}} placeholder = { COMMIT_BOX.input.placeholder }>
                {commitMsg}
            </textarea>
        }   

        {(editable && error) &&  
            <Alert color="warning">{QUERY_EDITOR_LABEL.syntaxErrorMessage}</Alert>
        }      
        </Container>
    )
}



