import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const UserCapabilityList = ({capabilities, query}) => {
    if(!capabilities || !capabilities.length) return null
    return (<ResultViewer type ="table" query={query} bindings= {capabilities}/>)
} 
    