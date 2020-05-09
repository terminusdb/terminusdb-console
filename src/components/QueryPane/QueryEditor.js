import React, { useState } from "react"
import { Container, Button } from 'reactstrap'
import { CodeEditor, CodeViewer } from './Editor'
import TerminusClient from '@terminusdb/terminus-client';
import {QUERY_SUBMIT, HIDE_QUERY_EDITOR, SHOW_QUERY_EDITOR} from './constants'
import {LanguageSwitcher} from "./LanguageSwitcher"
import { commitBox } from "../../variables/formLabels"


/**
 * Controls the display of query viewer and editor
 */
export const QueryEditor = ({query, children, className, language, languages, text, editable, closable, submit, languageChooser}) => {
    const qeclass = className || 'terminus-query-editor'
    editable = typeof editable != "undefined" ? editable : true 
    closable = typeof closable != "undefined" ? closable : false
    display = display || "open"
    submitMsg = submit || QUERY_SUBMIT
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

    //closable
    //display icon: 
    //readonly    
    //error Checking 
    //onSubmit
    //editor prompts
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
        }
    }

    function checkContent(){
        //sets errors internally if doesn't work
        setError(false)
        let woql = makeWOQLFromString(content, baseLanguage)
        if(woql) {
            setContainsUpdate(woql.containsUpdate())
        }
    }    

    function hideEditor(){
        display = "hidden"
    }

    function updateContent(cont){
        setContent(cont)
        setError(false)
    }

    function newLanguageVersion(lang){
        let woql = makeWOQLFromString(content, baseLanguage)
        setLanguage(lang)
        setShowLanguage(false)
        setContent(makeWOQLIntoString(woql, lang))
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
                var nw = eval(text)
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

    if(display == "hidden") return (<span>this is hidden - icon</span>)
    return(<Container className={qeclass} >
            {closeable && 
                <Button onClick = { hideEditor }> {tag.CLOSE_RULE} </Button>}
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
            {!showLanguage && editable && 
                <CodeEditor onChange={updateContent} onBlur={checkContent} text={content} language={baseLanguage}/>
            }
            {!editable && !showLanguage &&  
                <CodeViewer text={content} language={baseLanguage}/>
            }
            {showLanguage && 
                <CodeViewer text={showContent} language={showLanguage}/>
            }
            {children}
            {(editable && userMsg) &&  
                <Alert color="warning">userMsg</Alert>
            }
            {editable && containsUpdate && 
                <textarea onChange={(editor, data, value) => { setCommitMsg(value)}} placeholder = { commitBox.input.placeholder }>
                    {commitMsg}
                </textarea>
            }
            {editable && 
                <Button>submitMsg</Button>
            }
        </Container>
    )
}



