import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';


export const DocumentList = ({result, query, limit, start, orderBy, prefixes, onLoadDocument, totalRows, setLimits, setOrder}) => {
    if(!result) return null
    let onRowClick = function(row){
        if(onLoadDocument) {
            onLoadDocument(row.original["Document ID"], row.original["Type ID"])
        }
    }
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Document ID", "Name", "Type Name", "Description")
    tabConfig.pagesize(limit)
    tabConfig.pager("remote")
    tabConfig.row().click(onRowClick)
    tabConfig.column().minWidth(150).width(0)
    tabConfig.column("Type Name").header("Type").minWidth(100)
    tabConfig.column("Description").width(300)
    return (
        <WOQLTable 
            result={result} 
            view={tabConfig.json()} 
            query={query}
            start={start}
            orderBy={orderBy}
            totalRows={totalRows}
            prefixes={prefixes} 
            setOrder={setOrder} 
            setLimits={setLimits} 
        />)
} 
 