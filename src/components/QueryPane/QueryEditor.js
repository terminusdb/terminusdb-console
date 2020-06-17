import React, { useState, useEffect } from "react"
import { CodeEditor, CodeViewer } from './Editor'
import {QUERY_SUBMIT, HIDE_QUERY_EDITOR, SHOW_QUERY_EDITOR} from './constants.querypane'
import {LanguageSwitcher} from "./LanguageSwitcher"
import { COMMIT_BOX, QUERY_EDITOR_LABEL  } from "./constants.querypane"
import {makeWOQLFromString , makeWOQLIntoString} from "./queryPaneUtils"
import {Alert} from "reactstrap";
/**
 * Controls the display of query viewer and editor
 */
export const QueryEditor = ({query, baseLanguage, setBaseLanguage, content, saveContent,showLanguage, showContent, setShowContent, setShowLanguage,languages, editable, children, submit,updateQuery}) => {
    //const qeclass = className || TOOLBAR_CSS.container
    editable = typeof editable != "undefined" ? editable : true
    submit = submit || QUERY_SUBMIT
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
            let woql = makeWOQLFromString(content, baseLanguage, setError)
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
    function showLanguageVersion(lang){
        if(lang == baseLanguage){
            setShowLanguage(false)
            setShowContent("")
        }else {
            if(typeof content !=="string" || content===""){
                setShowLanguage(lang)
                setShowContent("")
            }else{
                let woql = makeWOQLFromString(content, baseLanguage)
                if(woql){
                    setShowLanguage(lang)
                    setShowContent(makeWOQLIntoString(woql, lang))
               }
            }
        }
    }

/*
 containerRow: "query-pane-toolbar",
    edit: "query-pane-edit",
    row: "query-pane-toolbar-row",
    queryPaneControls: "query-pane-controls",
    runQuery: "run-query-button",
    dropdown:"query-pane-menu",
    rowHeight: "query-pane-dropdown-row"*/


    if(editable && error) console.log(error)
    return(<div className="tdb__qpane__editor" >
            <div className="tdb__commit__bar" >
                <div className="tdb__commit__bar__input">
                    <input id="commitMessage" type="text"/>
                </div>
                <div className="tdb__commit__bar__tools">
                    {languages &&
                    <LanguageSwitcher
                        active={!error}
                        baseLanguage={baseLanguage}
                        showLanguage={showLanguage}
                        languages={languages}
                        editable={true}
                        onChange={showLanguageVersion}
                        onEdit={newLanguageVersion}
                    />
                    }
                    {editable &&  <button className="tdb__button__base tdb__button__base--green tdb__commit__bar--button" onClick={sendQuery}>{submit}</button>}
                </div>
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

        {(editable && error) &&
            <Alert color="warning">{QUERY_EDITOR_LABEL.syntaxErrorMessage}</Alert>
        }

        {children}

        {/*(editable) &&
            <textarea onChange={(editor, data, value) => {setCommitMsg(editor.target.value)}} id={COMMIT_BOX.input.id}
                placeholder = { COMMIT_BOX.input.placeholder }>
        */}

        </div>
    )
}
