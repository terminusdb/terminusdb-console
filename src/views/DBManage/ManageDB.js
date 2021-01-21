import React, {useState} from "react";
import { Branch } from "./Branch"
import { Merge } from "./Merge"
import { MANAGE_SECTIONS } from "./constants.dbmanage"
import { RiverOfSections } from "../Templates/RiverOfSections"
import {PageView} from "../Templates/PageView"
import {ControlledTable} from '../Tables/ControlledTable'
import { FrameViewer } from '@terminusdb/terminusdb-react-components';
import {BiArrowBack, BiNetworkChart} from "react-icons/bi"
import TerminusClient from '@terminusdb/terminusdb-client'
import {RiDeleteBin5Line} from "react-icons/ri"
/*
export const ManageDB = (props) => {
    function getBranchQuery(){
        return TerminusClient.WOQL.lib().branches()
    }
    const [query, setQuery] = useState(getBranchQuery())

    const getDeleteButton=()=>{
		return <span className="schema-toolbar-delete-holder" title={"Delete Document"}>
            <RiDeleteBin5Line color="#721c24" className='schema-toolbar-delete'/>
        </span>
	}

    const deleteBranch = (cell) => {
        console.log(cell.row.original)
        alert("delete branch")
    }

    const selectBranch = (branch_iri) => {
        alert("select branch " + branch_iri)
    }


    let onBranchClick = function(cell){
        let row = cell.row
        //setReport(false)
        if(row) {
            selectBranch(row.original["Branch IRI"])
        }
    }



    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Branch ID", "Commit ID", "Time", "Delete")
    tabConfig.column("Time").header("Last Commit Time").minWidth(50).width(80).renderer({type: "time"}).click(onBranchClick)
    tabConfig.column("Delete").minWidth(80).width(80).unsortable(true).click(deleteBranch).render(getDeleteButton)

    //tabConfig.column_order("Class ID", "Class Name", "Parents", "Children", "Abstract", "Description")
    tabConfig.column("Commit ID").header("Latest Commit").click(onBranchClick)
    tabConfig.column("Branch ID").click(onBranchClick)
    tabConfig.pager("remote")
    tabConfig.pagesize(10)
    //tabConfig.row().click(showClass)
    

    return (
    	<PageView report={props.report} dbPage={true}>
            <ControlledTable 
                limit={tabConfig.pagesize()} 
                query={query} 
                view={tabConfig} 
            />
        </PageView>
    )
}*/


export const ManageDB = (props) => {
    return (
    	<PageView report={props.report} dbPage={true}>
	        <RiverOfSections key='a' sections={MANAGE_SECTIONS} label={props.label}>
	            <Branch key="branch" />
	            <Merge key="merge" />
	        </RiverOfSections>
	    </PageView>
    )
}

