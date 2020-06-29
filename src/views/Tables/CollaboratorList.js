import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const CollaboratorList = ({users}) => {
    if(!users || !users.length) return null
    return (<ResultViewer type ="table" bindings= {users}/>)
} 
    