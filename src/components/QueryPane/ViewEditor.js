import React, { useState } from "react"
import { Button, Container } from 'reactstrap'
import {SHOW_VIEW_EDITOR, HIDE_VIEW_EDITOR} from './constants'
import { CodeEditor } from "./Editor"

//lets us change the view for a single resultview

export const ViewEditor = ({bindings, display, report, type, view, language, query, updateQuery}) => {
    const [content, setContent] = useState();
    const [hasDisplay, setDisplay] = useState(display);    

    function hideEditor(){
        setDisplay("hidden")
    }
    
    function updateContent(cont){
        setContent(cont)
    }

    function showEditor(){
        setDisplay("full")
    }

    if(hasDisplay == "hidden") return (<Button onClick = { showEditor }>{SHOW_VIEW_EDITOR}</Button>)
    return(
        <Container>
            <Button onClick = { hideEditor } close>{HIDE_VIEW_EDITOR}</Button>
            <CodeEditor onChange={updateContent} text={content} language={language}/>
        </Container>
    )
}
