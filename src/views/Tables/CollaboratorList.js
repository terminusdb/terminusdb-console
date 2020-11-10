import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';

export const CollaboratorList = ({users}) => {
    if(!users || !users.length) return null
    const tabConfig= TerminusClient.View.table();
    //tabConfig.column_order("Class ID", "Class Name", "Parents", "Children", "Abstract", "Description")

    return (<WOQLTable bindings={users} view={tabConfig.json()} />)
    return (<ResultViewer type="table" bindings={users} />)
} 
    