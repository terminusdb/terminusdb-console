import React from "react"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"

export const UserList = ({users, query}) => {
    if(!users || !users.length) return null
    return (<ResultViewer type ="table" query={query} bindings= {users}/>)
} 
    