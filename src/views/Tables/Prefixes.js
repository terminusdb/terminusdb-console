import React from "react"
import RenderTable from "../../components/Table/RenderTable"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import { WOQLTable } from '@terminusdb/terminusdb-react-components';
import TerminusClient from '@terminusdb/terminusdb-client';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { AiFillLock, AiOutlineFork, AiOutlineCloudDownload, AiOutlineCheckCircle, AiFillStar,
    AiFillCrown, AiFillEdit, AiOutlineStar, AiOutlineThunderbolt, AiOutlineLink,
    AiOutlineMail, AiOutlineUser, AiOutlineInbox,  AiOutlineGlobal, AiOutlineBell, AiOutlineCloudSync,
    AiOutlineBranches, AiOutlineSchedule, AiOutlineDelete, AiOutlineWarning, AiOutlineCloud, AiOutlineLogin, AiFillWarning, AiOutlinePlus, AiOutlineQuestion, AiOutlineQuestionCircle} from 'react-icons/ai';

export const BuiltInPrefixes = ({prefixes}) => {
    const tabConfig= TerminusClient.View.table();
    tabConfig.column("prefix").header("Prefix").width(100)
    tabConfig.column("url").header("IRI").width(400)
    return <WOQLTable bindings={prefixes} view={tabConfig.json()}/>

    const dataProvider = {columnData:prefixes, columnConf:cols}
    return (<RenderTable dataProvider={dataProvider} />)

    //if(!prefixes || !prefixes.length) return null
    //return (<ResultViewer type ="table" bindings= {prefixes}/>)
} 
    
export const CustomPrefixes = ({prefixes, query, isEdit, onDelete, onEdit}) => {
    if(!prefixes || !prefixes.length) return null

    let onEd = (cell) => {
        onEdit(cell.row.original["Prefix"]["@value"])
    }


    let onDel = (cell) => {
        onDelete(cell.row.original["Prefix Pair IRI"])
    }

    let ngraphs = []
    for(var i = 0; i<prefixes.length; i++){
        let ng = prefixes[i]
        if(["doc", "scm"].indexOf(ng['Prefix']["@value"]) == -1){
            ng["Delete"] = <span className="schema-toolbar-delete-holder" title={"Delete "}>
                <RiDeleteBin5Line color="#721c24" className='schema-toolbar-delete'/>
            </span>
        }
        else {
            ng["Delete"] = ""
        }
        ng["Edit"] = <span className="schema-toolbar-delete-holder" title={"Edit "}>
            <AiFillEdit className="db_info_icon_spacing"/>
        </span>
        ngraphs.push(ng)
    }

    const tabConfig= TerminusClient.View.table();
    if(prefixes.length > 10){
        tabConfig.pager(true).pagesize(10)
    }
    if(isEdit){
        tabConfig.column_order("Prefix", "IRI")
    }
    else {
        tabConfig.column_order("Prefix", "IRI", "Edit", "Delete")
        tabConfig.column("Delete").unsortable(true).width(30).click(onDel)
        tabConfig.column("Edit").unsortable(true).width(30).click(onEd)
    }
    tabConfig.column("Prefix").width(100)
    tabConfig.column("IRI").width(400).renderer({maxword: 100})

    return (
        <div style={{"marginBottom": "40px"}} >
            <WOQLTable bindings={ngraphs} view={tabConfig.json()} query={query}/>
        </div>
    )
} 
    
