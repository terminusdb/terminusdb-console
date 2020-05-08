import React, { useState } from "react"
import { Container } from 'reactstrap'
import { Editor } from './Editor'


export const QueryEditor = ({query, children, className}) => {
    const qeclass = className || 'terminus-query-editor'    
    return(
        <Container className={qeclass} >
            <Editor>
                Here goes some text...
            </Editor>
            {children}
        </Container>
    )
}