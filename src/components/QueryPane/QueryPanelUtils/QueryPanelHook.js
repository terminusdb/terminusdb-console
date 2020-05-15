import React, { useState, useEffect } from "react"
import TerminusClient from '@terminusdb/terminusdb-client';

function WOQLQueryContainerHook({query, startLanguage, queryText}){

 /*
    * origin base language this is the language that I can edit 
    */
    const [baseLanguage, setBaseLanguage] = useState(startLanguage || "js");
    /*
    * if we have a start query or a start queryText for the editor and the startLanguage for the query
    */
    let initcontent = queryText || "" 
    if(!initcontent && query){
        initcontent = makeWOQLIntoString(query, baseLanguage)
    }

    /*
    *onChange will be update
    */
    const [content, setContent] = useState(initcontent);

    
    /*
    *show language is the language selected 
    */
    const [showLanguage, setShowLanguage] = useState(false);   

    const [showContent, setShowContent] = useState("");
    
    
    
    /*
    * if is edit mode and the query is an update query
    */
   // const [containsUpdate, setContainsUpdate] = useState(false);

  //  const [error, setError] = useState(false);

   // const [commitMsg, setCommitMsg] = useState();


    /*
    * onBlur
    */
   /* function checkContent(){
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
            if(updateQuery) updateQuery(woql, commitMsg, content)
        }
    }*/


    function updateContent(cont){
        setContent(cont)
        setError(false)
    }

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
    
    return [newLanguageVersion,showLanguageVersion,setContent,content,baseLanguage,showLanguage]
}