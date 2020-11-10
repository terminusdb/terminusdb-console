import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {PageView} from '../Templates/PageView'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DocumentListView} from '../Document/DocumentList'
import {DocumentView, NewDocumentView} from '../Document/DocumentView'
import {CsvList} from '../Tables/CsvList'
import {DBContextObj} from '../../components/Query/DBContext'
import {FileLoader} from "../Document/FileLoader"

const DocumentPage = (props) => {
    const {graphs} = DBContextObj()
    const [mode, setMode] = useState(false)
    const [docID, setDocID] = useState(props.docid)

    useEffect(() => {
        if(graphs){
            let iss = "instance"
            for(var key in graphs) {
                if(graphs[key].type == "schema"){
                    iss = "schema"
                    break;
                }
            }
            setMode(iss)
        }
    }, [graphs])

    function setDocument(docid){
        setDocID(docid)
    }

    return (
        <PageView page="document" dbPage={true}>
            {!mode && 
                <Loading />
            }
            {mode == "schema" && 
                <DocumentPageWithSchema 
                    docid={docID}
                    doctype={props.doctype}
                    setDocument={setDocument}
                />
            }
            {mode == "instance" && 
                <NoSchemaDocumentPage 
                    docid={docID} 
                    doctype={props.doctype}
                    setDocument={setDocument}
                />
            }
        </PageView>
    )
}

/**
 * Loads full list of document types and total count of documents to make them available to all sub-parts
 */

const DocumentPageWithSchema = ({doctype, docid, setDocument}) => {
    let WOQL = TerminusClient.WOQL
    const {woqlClient} = WOQLClientObj()
    const {ref, branch} = DBContextObj()
    const [cnt, setCount] = useState()
    const [types, setTypes] = useState()
    const [isCreating, setIsCreating] = useState(false)

    const docQuery = () => { 
        return WOQL.order_by("v:Class Name", WOQL.lib().document_classes())
    }

    const [updateQuery, report, qresult, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery(),
        branch,
        ref,
    )

    const cntQuery = () => { 
        return WOQL.count("v:Documents").distinct("v:docid")
            .triple("v:docid", "type", "v:dtype").sub("system:Document", "v:dtype")
    }

    const [updateQuery2, report2, qresult2, woql2] = WOQLQueryContainerHook(
        woqlClient,
        cntQuery(),
        branch,
        ref,
    )

    const setCreating = (type) => {        
        setIsCreating(type)
    }
    
    useEffect(() => {
        if(qresult){
            setTypes(qresult.bindings)
        }
    }, [qresult])

    useEffect(() => {
        if(qresult2){
            let v = 0
            if(qresult2.bindings && qresult2.bindings[0] && qresult2.bindings[0]['Documents'] && qresult2.bindings[0]['Documents']['@value'])
                v = qresult2.bindings[0]['Documents']['@value']
            setCount(v)
        }
    }, [qresult2])

    function closeDV(){
        setIsCreating(false)
        setDocument()
    }
    
    return (
        <>
            {isCreating && 
                <NewDocumentView 
                    selectDocument={setDocument} 
                    close={closeDV} 
                    doctype={isCreating} 
                    types={types} 
                    total={cnt} 
                />
            }
            {!isCreating && docid && 
                <DocumentView 
                    close={closeDV} 
                    docid={docid} 
                    types={types} 
                    total={cnt} 
                />
            }
            {!isCreating && !docid && 
                <DocumentListView 
                    selectDocument={setDocument} 
                    createDocument={setCreating} 
                    types={types} 
                    total={cnt} 
                    doctype={doctype} 
                />
            }
        </>
    )
}

const NoSchemaDocumentPage = ({doctype, docid, setDocument}) => {
    return <>
        <FileLoader docid={docid} />
        <CsvList />
    </>
}




export default DocumentPage
