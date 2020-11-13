import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {ControlledTable} from '../Tables/ControlledTable'
import {Row, Col} from "reactstrap"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {TypeStats} from "./TypeStats"
import {convertStringsToJson} from '../../utils/helperFunctions';
import {DocumentTypeFilter, DocumentSubTypeFilter} from "./TypeFilter"
import {DEFAULT_PAGE_SIZE, DEFAULT_ORDER_BY} from "./constants.document"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {CSVPreview} from '../../Components/CSVPane/CSVPreview'
import {DOCTYPE_CSV} from '../../Components/CSVPane/constants.csv'

export const DocumentListView = ({setIsAdding, isAdding, types, selectDocument, setCurrent, docType, csvs, setCsvs}) => {
    const [preview, setPreview] = useState({show:false, fileName:false, data:[]})
    const [loading, setLoading]=useState(false)
    const [report, setReport]=useState(false)

    const { woqlClient} = WOQLClientObj()
    const {ref, branch, prefixes} = DBContextObj()

    let WOQL = TerminusClient.WOQL

    const docQuery = () => {
        let q = WOQL.and(
            WOQL.lib().document_metadata()
        )
        if(docType){
            q.sub(docType, "v:Type ID")
        }
        return q
    }

    const [query, setQuery] = useState(docQuery())

    const adding = (isadd) => {
        if(isadd) setIsAdding(true)
        else setIsAdding(false)
    }

    useEffect(() => {
        setQuery(docQuery())
        if(docType){
            setCurrent(getTypeMetadata(types, docType))
        }
    }, [docType])


    function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

    function csvRowClick(name){
        let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
        return woqlClient.getCSV(name, false).then((results) =>{
            const jsonRes=convertStringsToJson(results)
            setPreview({show: true, fileName: name, data: jsonRes});
        })
        .catch((err) => process_error(err, update_start, "Failed to retrieve file " + name))
        .finally(() => setLoading(false))
    }

    /*function csvRowClick(id){
        const q=limit(50).triple('v:CSV ID', 'type', 'scm:CSV').eq('v:CSV ID', id)
            .triple('v:CSV ID', 'scm:csv_row', 'v:CSV Rows').triple('v:CSV Rows', 'v:Properties', 'v:Value')
            .quad('v:Properties', 'label', 'v:Property Name', 'schema/main')
        setPreview({show: true, fileName: name, query:q})
    }*/

    let onRowClick = function(row){
        if(selectDocument) {
            if(row.original["Type ID"]==DOCTYPE_CSV){
                csvRowClick(row.original["Document ID"])
            }
            else selectDocument(row.original["Document ID"], row.original["Type ID"])
        }
    }

    let any_old_rendering_function = (cell) => {
        return <span>Delete Me Buddy</span>
        //cell.row.original
    }

    //let docs = (docType ? (docCount || 0) : 0)
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Document ID", "Name", "Type Name", "Description")
    tabConfig.pagesize(10)
    tabConfig.pager("remote")
    tabConfig.row().click(onRowClick)
    //tabConfig.column("Delete").click(function(){alert("del")}).render(any_old_rendering_function)
    
    tabConfig.column("Document ID", "Name").minWidth(100)
    //tabConfig.column("Document ID", "Name").minWidth(150).width(150)
    tabConfig.column("Type Name").header("Type").minWidth(80)
    //tabConfig.column("Description").width(0)

    return (<>
        {loading &&  <Loading type={TERMINUS_COMPONENT} />}
        {!isAdding && <ControlledTable
            query={query}
            freewidth={true}
            view={tabConfig}
            limit={tabConfig.pagesize()}/>}
        {!isAdding && (docType==DOCTYPE_CSV) && <>
            <Row className="generic-message-holder">
                {report && <TerminusDBSpeaks report={report}/>}
            </Row>
            <CSVPreview preview={preview} setPreview={setPreview}/>
        </>}
    </>)
}

const DocumentTypeMeta = ({doctype, meta,count,  onCreate}) => {
    if(!doctype || !meta) return null
    return <span>
            <span title={doctype + ": " + meta.description}>{count} {meta.label} Document{(count === 1 ? "" : "s")} </span>
            {!meta.abstract &&
                <button onClick={onCreate}> Create New </button>
            }
        </span>
}


const DocumentLimits = ({doctype, meta, start, limit, setLimit}) => {
    const [mstart, setMstart] = useState(start)
    const [mlimit, setMlimit] = useState(limit)

    function doChange(){
        if(mstart != start || mlimit != limit) setLimit(mlimit, mstart)
    }

    function chLimit(e){
        if(e && e.target) setMlimit(e.target.value || 0)
    }

    function chStart(e){
        if(e && e.target) setMstart(e.target.value || 0)
    }


    return <span>
        Limit <input type="text" defaultValue={mlimit} onChange={chLimit}/>
        Start <input type="text" defaultValue={mstart} onChange={chStart}/>
        <button onClick={doChange}>Update</button>
    </span>
}


function getTypeMetadata(types, de){
    for(var i = 0; i<types.length; i++){
        if(types[i]['Class ID'] == de){
            let tm = {
                id: types[i]['Class ID'],
                label: types[i]['Class Name']['@value'],
                description: types[i]['Description']['@value']
            }
            if(types[i]['Abstract'] && types[i]['Abstract']['@value'] && types[i]['Abstract']['@value'] == "Yes")
                tm.abstract = true
            return tm
        }
    }
}
