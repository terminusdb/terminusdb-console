import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const CollaboratorList = ({users}) => {
    if(!users || !users.length) return null
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("user", "role", "Database Name", "public")
    tabConfig.pager(true).pagesize(10)

    tabConfig.column().minWidth(0)
    tabConfig.column("role").header("Role")
    tabConfig.column("user").header("Collaborator")
    tabConfig.column("public").header("Privacy").width(80)
    tabConfig.column("Database Name").header("Database").width(300)
    return (<WOQLTable bindings={users} view={tabConfig.json()} />)
    return (<ResultViewer type="table" bindings={users} />)
} 
    