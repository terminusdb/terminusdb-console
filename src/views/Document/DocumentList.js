import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {DocumentList} from '../Tables/DocumentList'
import {Row, Col} from "reactstrap"
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {FileLoader} from "./FileLoader"
import {CsvList} from '../Tables/CsvList'
import {DocumentStats} from "./TypeStats"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "./TypeFilter"
import {DEFAULT_PAGE_SIZE, DEFAULT_ORDER_BY} from "./constants.document"

export const DocumentListView = ({doctype, total, types, selectDocument, createDocument}) => {
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE || 20)
    const [start, setStart] = useState(0)
    const [loading, setLoading] = useState(true)
    const [docType, setDocType] = useState(doctype)
    const [docCount, setDocCount] = useState()
    const [listing, setListing] = useState()
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
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
        if(orderBy){
            if(limit) return WOQL.limit(limit).start(start).order_by(...orderBy, q)
            else return WOQL.order_by(...orderBy, q)
        }
        else {
            if(limit) return WOQL.limit(limit).start(start, q)
            else return q
        }
    }

    const [updateQuery, report, qresult, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        branch,
        ref,
    )

    useEffect( () => {
        if(qresult){
            let nq = docQuery()
            setLoading(true)
            updateQuery(nq)
        }
    }, [docType, limit, start, orderBy])

    useEffect( () => {
        if(types){
            if(docType) setCurrent(getTypeMetadata(types, docType))
        }
    }, [docType, types])

    useEffect( () => {
        setLoading(false)
        if(qresult){
            setListing(qresult)
        }
    }, [qresult])


    const adding = (isadd) => {
        if(isadd) setIsAdding(true)
        else setIsAdding(false)
    }

    const changeDocType = (dt) => {
        if(dt !== docType) {
            setStart(0)
            setDocType(dt)
        }
    }

    const setOrdering = (ord) => {
        if(JSON.stringify(orderBy) != JSON.stringify(ord)){
            setOrderBy(ord)
            setStart(0)
        }
    }

    const setLimits = (l, s) => {
        let ll = parseInt(l) || 0
        let ss = parseInt(s) || 0
        if(ll != limit) setLimit(ll)
        if(ss != start) setStart(ss)
    }

    const doCreate = () => {
        if(createDocument) createDocument(docType)
    }

    let docs = (docType ? (docCount || 0) : total)


    return (<>
            <FileLoader adding={adding} />
            {isAdding &&
                <CsvList />
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
                    <DocumentTypeMeta count={docCount} types={types} meta={current} doctype={docType} onCreate={doCreate} />
                </Col>
                <Col>
                    <DocumentStats 
                        total={total} 
                        meta={current} 
                        doctype={docType} 
                        limit={limit} 
                        setTotal={setDocCount}
                    />
                </Col>
                <Col>
                    <DocumentSubTypeFilter doctype={docType} meta={current} setType={changeDocType} />
                </Col>
            </Row>
            }
        {loading &&
            <Loading />
        }
        {(report && report.rows > 0 && !isAdding) && 
            <>
            <DocumentList 
                result={listing}
                prefixes={prefixes}
                onLoadDocument={selectDocument}
                query={woql}
                limit={limit}
                start={start}
                orderBy={orderBy}
                setLimits={setLimits}
                setOrder={setOrdering}
                totalRows={docs} 
             />            
        </>}
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