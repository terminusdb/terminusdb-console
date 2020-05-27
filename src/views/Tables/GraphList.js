import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const GraphList = ({list}) => {
    if(!list || !list.length) return null
    return (<ResultViewer type ="table" bindings= {list}/>)
} 
