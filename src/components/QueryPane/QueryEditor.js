import React, { useState, useEffect } from "react"
import { CodeEditor, CodeViewer } from './Editor'
import {QUERY_SUBMIT, HIDE_QUERY_EDITOR, SHOW_QUERY_EDITOR} from './constants.querypane'
import {LanguageSwitcher} from "./LanguageSwitcher"
import { COMMIT_BOX, QUERY_EDITOR_LABEL  } from "./constants.querypane"
import {makeWOQLFromString , makeWOQLIntoString} from "./queryPaneUtils"
import TerminusClient  from "@terminusdb/terminusdb-client"
import {Alert} from "reactstrap";
/**
 * Controls the display of query viewer and editor
 */
export const QueryEditor = ({query, setMainError, mainError, baseLanguage, setBaseLanguage, content, saveContent,showLanguage, showContent, setShowContent, setShowLanguage,languages, editable, children, submit,updateQuery}) => {
    //const qeclass = className || TOOLBAR_CSS.container
    editable = typeof editable != "undefined" ? editable : true
    submit = submit || QUERY_SUBMIT
    /*
    * if is edit mode and the query is an update query
    */
    const [containsUpdate, setContainsUpdate] = useState(false);

    //const [error, setCurrentError] = useState(mainError);

    const [commitMsg, setCommitMsg] = useState();

    const setError =(err)=>{
        //setCurrentError(err)
        setMainError(err);
    }

    //useEffect(() => {
        //const WOQL = TerminusClient.WOQL
        //let prelude = WOQL.emerge()
        //eval(prelude)
    //}, [])

    function onBlur(value){
        //const value=editor.doc.getValue();
        saveContent(value);
        checkContent();    
        //sendMainError();
    }

    /*
    * onBlur
    */
    function checkContent(){
        //sets errors internally if doesn't work
        setError(false)
        if(content){
            try{
                const woql = makeWOQLFromString(content, baseLanguage)
                /*
                * check if the query is an update query and need a commitSMS
                */
                setContainsUpdate(woql.containsUpdate())
                return woql
            }catch(err){
                console.log(err)
                setError(err)
                return false;
            }
            
        }
        return false
    }

    const sendQuery=()=>{
        let woql = checkContent()
        if(woql){
            if(updateQuery) updateQuery(woql, commitMsg)
        }
    }

    /*
    * change the current editable language
    */
    const newLanguageVersion=(lang)=>{
        /*
        * change the edit language and set the content like editable
        */
        setBaseLanguage(lang)
        setShowLanguage(false)
        saveContent(showContent)
        setShowContent("");
    }

    /*
    * the current language visualized
    */
    const showLanguageVersion=(lang)=>{
        if(lang == baseLanguage){
            setShowLanguage(false)
            setShowContent("")
        }else {
            if(typeof content !=="string" || content===""){
                setShowLanguage(lang)
                setShowContent("")
            }else{
                try{
                    let woql = makeWOQLFromString(content, baseLanguage)
                    if(woql){
                        setShowLanguage(lang)
                        setShowContent(makeWOQLIntoString(woql, lang))
                    }
                }catch(err){
                    console.log(err)
                    setError(err)
                }
            }
        }
    }

    return(<div className="tdb__qpane__editor" >
            <div className="tdb__commit__bar" >
                <div className="tdb__commit__bar__input">
                    {editable && 
                        <input onBlur={(evt) => {setCommitMsg(evt.target.value)}} id={COMMIT_BOX.input.id} type="text" placeholder = { COMMIT_BOX.input.placeholder }/>
                    }
                </div>
                <div className="tdb__commit__bar__tools">
                    {languages &&
                    <LanguageSwitcher
                        active={!mainError}
                        baseLanguage={baseLanguage}
                        showLanguage={showLanguage}
                        languages={languages}
                        editable={true}
                        onChange={showLanguageVersion}
                        onEdit={newLanguageVersion}
                    />
                    }
                    {editable &&  <button id="runQuery" className="tdb__button__base tdb__button__base--green tdb__commit__bar--button" onClick={sendQuery}>{submit}</button>}
                </div>
           </div>

        {(!showLanguage && editable) &&
            <CodeEditor onSubmit={sendQuery} onBlur={onBlur} text={content} language={baseLanguage}/>
        }

        {!editable && !showLanguage &&
            <CodeViewer text={content} language={baseLanguage}/>
        }

        {showLanguage &&
            <CodeViewer text={showContent} language={showLanguage}/>
        }

        {children}
        </div>
    )
}
