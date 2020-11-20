import React from "react"
//import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';
import { RiDeleteBin5Line } from 'react-icons/ri';

export const GraphList = ({graphs, isEdit, onDelete}) => {
    if(!graphs || !graphs.length) return null
    let ngraphs = []

    let onDel = (cell) => {
        let type = cell.row.original.Type
        let id = cell.row.original.ID
        console.log(type, id)
        onDelete(id, type)
    }

    for(var i = 0; i<graphs.length; i++){
        let ng = graphs[i]
        ng["Delete"] = <span className="schema-toolbar-delete-holder" title={"Delete "}>
            <RiDeleteBin5Line color="#721c24" className='schema-toolbar-delete'/>
        </span>
        ngraphs.push(ng)
    }
    const tabConfig= TerminusClient.View.table();
    if(!isEdit){
        tabConfig.column_order("ID", "Type", "Triples", "Size", "Delete")
        tabConfig.column("Delete").unsortable(true).click(onDel).width(30)
    }
    else {
        tabConfig.column_order("ID", "Type", "Triples", "Size")
    }
    
    tabConfig.column("Triples").renderer({type: "number", datatype: "xsd:integer"})
    tabConfig.column("Size").renderer({type: "number", datatype: "xsd:integer", format: "bytes"})

    return (<WOQLTable bindings={ngraphs} view={tabConfig.json()} />)

    //return (<ResultViewer type ="table" query={query} updateQuery={updateQuery} bindings= {graphs}/>)
} 
    