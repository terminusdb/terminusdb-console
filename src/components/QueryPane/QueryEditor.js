import React, { useState, useEffect } from "react"
import { Container, Button, Alert } from 'reactstrap'
import { CodeEditor, CodeViewer } from './Editor'
import TerminusClient from '@terminusdb/terminusdb-client';
import {QUERY_SUBMIT, HIDE_QUERY_EDITOR, SHOW_QUERY_EDITOR} from './constants'
import {LanguageSwitcher} from "./LanguageSwitcher"
import { commitBox } from "../../variables/formLabels"


/**
 * Controls the display of query viewer and editor
 */
export const QueryEditor = ({query, children, className, language, languages, text, editable, closable, submit, languageChooser, display, updateQuery}) => {
    const qeclass = className || 'terminus-query-editor'
    editable = typeof editable != "undefined" ? editable : true 
    closable = ((typeof closable != "undefined") ? closable : false)
    display = display || "open"
    submit = submit || QUERY_SUBMIT
    languageChooser = languageChooser || "button"

    let initcontent = text || "" 
    if(!initcontent && query){
        initcontent = makeWOQLIntoString(query, language)
    }

    const [content, setContent] = useState(initcontent);
    const [showLanguage, setShowLanguage] = useState(false);
    const [baseLanguage, setLanguage] = useState(language || "js");
    const [showContent, setShowContent] = useState("");
    const [error, setError] = useState(false);
    const [containsUpdate, setContainsUpdate] = useState(false);
    const [commitMsg, setCommitMsg] = useState();
    const [hasDisplay, setDisplay] = useState(display);


    function checkContent(){
        //sets errors internally if doesn't work
        setError(false)
        if(content){
            let woql = makeWOQLFromString(content, baseLanguage)
            if(woql) {
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

    function hideEditor(){
        setDisplay("hidden")
    }

    function showEditor(){
        setDisplay("full")
    }


    function updateContent(cont){
        setContent(cont)
        setError(false)
    }

    function newLanguageVersion(lang){
        let woql = makeWOQLFromString(content, baseLanguage)
        setLanguage(lang)
        setShowLanguage(false)
        if(woql) setContent(makeWOQLIntoString(woql, lang))
    }

    function showLanguageVersion(lang){
        if(lang == "original"){
            setShowLanguage(false)
            setShowContent("")            
        }
        else {
            let woql = makeWOQLFromString(content, baseLanguage)
            if(woql){
                setShowLanguage(lang)
                setShowContent(makeWOQLIntoString(woql, lang))    
            }
        }s
    }


    function makeWOQLFromString(str, lang){
        if(lang == "json"){
            try {
                let myj = JSON.parse(str)
                return new TerminusClient.WOQL.json(myj)
            }
            catch(e){
                setError(e)
            }
        }
        if(lang == "js"){
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
        if(lang == "js" || lang == "python" && woql){
            return woql.prettyPrint(lang)
        }
        else if(lang == "json" && woql){
            return JSON.stringify(woql.json(), undefined, 2);
        }
        else return ""
    }

    if(hasDisplay == "hidden") return (<Button onClick = { showEditor }>{SHOW_QUERY_EDITOR}</Button>)
    return(<Container className={qeclass} > 
            {(closable == true) && 
                <Button onClick = { hideEditor }>{HIDE_QUERY_EDITOR}</Button>
            }
            {languages && 
                <LanguageSwitcher 
                    active={!error}
                    language={baseLanguage} 
                    showLanguage={showLanguage} 
                    languages={languages} 
                    editable="true" 
                    onChange={showLanguageVersion} 
                    onEdit={newLanguageVersion} 
                    type={languageChooser}
                />
            }
            {(!showLanguage && editable) && 
                <CodeEditor onChange={updateContent} onBlur={checkContent} text={content} language={baseLanguage}/>
            }
            {!editable && !showLanguage &&  
                <CodeViewer text={content} language={baseLanguage}/>
            }
            {showLanguage && 
                <CodeViewer text={showContent} language={showLanguage}/>
            }
            {children}
            {(editable && error) &&  
                <Alert color="warning">Error Message</Alert>
            }
            {(editable && containsUpdate) && 
                <textarea onChange={(editor, data, value) => { setCommitMsg(value)}} placeholder = { commitBox.input.placeholder }>
                    {commitMsg}
                </textarea>
            }
            {editable && 
                <Container>
                    <Button onClick={sendQuery}>{submit}</Button>
                </Container>
            }
        </Container>
    )
}



