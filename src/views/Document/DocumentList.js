import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {ControlledTable} from '../Tables/ControlledTable'
import {Row, Col} from "reactstrap"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {FileLoader} from "./FileLoader"
import {CSVList} from '../../components/CSVPane/CSVList'
import {TypeStats} from "./TypeStats"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "./TypeFilter"
import {DEFAULT_PAGE_SIZE, DEFAULT_ORDER_BY} from "./constants.document"

export const DocumentListView = ({doctype, total, types, selectDocument, createDocument}) => {
    const [docType, setDocType] = useState(doctype)
    const [docCount, setDocCount] = useState()
    const [current, setCurrent] = useState(doctype)
    const [isAdding, setIsAdding] = useState(false)

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

    const changeDocType = (dt) => {
        if(dt !== docType) {
            setDocType(dt)
        }
    }

    useEffect(() => {
        setQuery(docQuery())
        if(docType){
            setCurrent(getTypeMetadata(types, docType))
        }
    }, [docType])


    const doCreate = () => {
        if(createDocument) createDocument(docType)
    }

    let onRowClick = function(row){
        if(selectDocument) {
            selectDocument(row.original["Document ID"], row.original["Type ID"])
        }
    }

    let docs = (docType ? (docCount || 0) : total)
    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Document ID", "Name", "Type Name", "Description")
    tabConfig.pagesize(10)
    tabConfig.pager("remote")
    tabConfig.row().click(onRowClick)
    tabConfig.column("Document ID", "Name").minWidth(100)
    //tabConfig.column("Document ID", "Name").minWidth(150).width(150)
    tabConfig.column("Type Name").header("Type").minWidth(80)
    //tabConfig.column("Description").width(0)


    return (<>
            <FileLoader adding={adding} />
            {isAdding &&
                <CSVList/>
            }
            {!isAdding &&
            <Row>
                <Col>
                    <TotalStats total={total} />
                </Col>
                <Col>
                    <DocumentTypeFilter types={types} meta={current} doctype={docType} setType={changeDocType} />
                </Col>
                <Col>
                    {docType &&
                        <TypeStats
                            total={total}
                            meta={current}
                            doctype={docType}
                            limit={tabConfig.pagesize()}
                            setTotal={setDocCount}
                        />
                    }
                    <DocumentTypeMeta count={docCount} types={types} meta={current} doctype={docType} onCreate={doCreate} />
                </Col>
                <Col>
                    <DocumentSubTypeFilter doctype={docType} meta={current} setType={changeDocType} />
                </Col>
            </Row>
            }
        {!isAdding &&
            <ControlledTable
                query={query}
                freewidth={true}
                view={tabConfig}
                limit={tabConfig.pagesize()}
            />
        }
    </>)
}




const TotalStats = ({total}) => {
    if(typeof total != "number") return null
    return <span>{total} Document{(total === 1 ? "" : "s")} </span>
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
