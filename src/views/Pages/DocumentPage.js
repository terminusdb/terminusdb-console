import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {PageView} from '../Templates/PageView'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DocumentListView} from '../Document/DocumentList'
import {DocumentView, NewDocumentView} from '../Document/DocumentView'
import {DBContextObj} from '../../components/Query/DBContext'
import {FileLoader} from "../Document/FileLoader"
import {DocumentNavTab} from "./DocumentNavTab"
import {ConsoleNavbar} from "../../components/Navbar/ConsoleNavbar";
import {CSVLoader} from "../../components/CSVPane/CSVLoader"
import {CSVInput} from "../../components/CSVPane/CSVInput"
import {CSVList} from '../../Components/CSVPane/CSVList'
import {DOCUMENT_VIEW} from '../../Components/CSVPane/constants.csv'
import {BsCardList} from "react-icons/bs"
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {Row, Col} from "reactstrap"

const DocumentPage = (props) => {
    const {graphs} = DBContextObj()
    const [mode, setMode] = useState(false)
    const [docID, setDocID] = useState(props.docid)
    const [isAdding, setIsAdding] = useState(false)
    const [cnt, setCount] = useState()
    const [types, setTypes] = useState()
    const [current, setCurrent] = useState(props.doctype)
    const [docType, setDocType] = useState(props.doctype)
    const [docCount, setDocCount] = useState()
    const [isCreating, setIsCreating] = useState(false)
    const [csvs, setCsvs]=useState([])
    const [availableCsvs, setAvailableCsvs]=useState([])
    const {woqlClient} = WOQLClientObj()
    const tabConfig= TerminusClient.View.table();

    const changeDocType = (dt) => {
        if(dt !== docType) {
            setDocType(dt)
            setCsvs([]) // clear selected cvs list when user chooses another doctype
        }
    }

    const setCreating = (type) => {
        setIsCreating(type)
    }

    const doCreate = () => {
        setCreating(docType)
    }

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

    const insertCsvs = (e) => {
        for(var i=0; i<e.target.files.length; i++){
            let files = {};
            files = e.target.files[i]
            const q=TerminusClient.WOQL.limit(50,
                TerminusClient.WOQL.triple('v:Document ID', 'type', 'scm:CSV').triple('v:Document ID', 'label', 'v:name'))
            woqlClient.query(q).then((results) => {
                setAvailableCsvs([])
                let res = new TerminusClient.WOQLResult(results, q)
        		const cBindings=res.getBindings()
        		for(var item in cBindings) {
                    let names=cBindings[item].name['@value']
                    setAvailableCsvs(arr => [...arr, names])
        		}
                setCsvs( arr => [...arr, files]);
            })
        }
    }

    return (
        <>
            <div id={props.id} className="console__page console__page--hidden" id="terminus-console-page">
                <ConsoleNavbar onHeadChange={props.onHeadChange}/>
                <DocumentNavTab total={cnt}
                    isAdding={isAdding}
                    types={types}
                    current={current}
                    doCreate={doCreate}
                    docCount={docCount}
                    docType={docType}
                    changeDocType={changeDocType}
                    limit={tabConfig.pagesize()}
                    setDocCount={setDocCount}
                    csvs={csvs}
                    setCsvs={setCsvs}
                    insertCsvs={insertCsvs}/>
                <main className="console__page__container console__page__container--width">
                    {!mode &&
                        <Loading/>
                    }
                    {mode == "schema" && <DocumentPageWithSchema
                        docid={docID}
                        setIsAdding={setIsAdding}
                        cnt={cnt}
                        setCount={setCount}
                        isAdding={isAdding}
                        setTypes={setTypes}
                        types={types}
                        setCurrent={setCurrent}
                        docType={docType}
                        setDocType={setDocType}
                        tabConfig={tabConfig}
                        setIsCreating={setIsCreating}
                        isCreating={isCreating}
                        csvs={csvs}
                        setCsvs={setCsvs}
                        insertCsvs={insertCsvs}
                        availableCsvs={availableCsvs}
                        setDocument={setDocument}/>}
                    {mode == "instance" && <NoSchemaDocumentPage
                        docid={docID}
                        doctype={props.doctype}
                        csvs={csvs}
                        setCsvs={setCsvs}
                        insertCsvs={insertCsvs}
                        availableCsvs={availableCsvs}
                        setDocument={setDocument}/>}
                </main>
            </div>
        </>
    )
}

/**
 * Loads full list of document types and total count of documents to make them available to all sub-parts
 */

const DocumentPageWithSchema = ({docid, setDocument, setIsAdding, isAdding, cnt, setCount, setTypes, types, setCurrent, setDocType, docType, tabConfig, setIsCreating, isCreating, csvs, setCsvs, availableCsvs, insertCsvs}) => {
    let WOQL = TerminusClient.WOQL
    const {woqlClient} = WOQLClientObj()
    const {ref, branch} = DBContextObj()

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

    function onCsvCancel() {
        setIsAdding(false)
        setCsvs([])
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
            {(csvs.length>0) && <>
                <CSVLoader csvs={csvs}
                    setCsvs={setCsvs}
                    insertCsvs={insertCsvs}
                    page={DOCUMENT_VIEW}
                    setIsAdding={setIsAdding}
                    availableCsvs={availableCsvs}
                    onCsvCancel={onCsvCancel}/>
                <span className="db-card-credit csv_subheader_section">
					<BsCardList color={"#787878"} className="csv_info_icon_spacing"/>
					<span className="db_info existing_csv_subheader">
						Csv Documents
					</span>
				</span>
                <CSVList/>
            </>}
            {!isCreating && docid &&
                <DocumentView
                    close={closeDV}
                    docid={docid}
                    types={types}
                    total={cnt}
                />
            }
            {!isCreating && !docid && (csvs.length==0) &&
                <DocumentListView
                    selectDocument={setDocument}
                    types={types}
                    setCurrent={setCurrent}
                    setIsAdding={setIsAdding}
                    isAdding={isAdding}
                    setDocType={setDocType}
                    docType={docType}
                    tabConfig={tabConfig}
                    csvs={csvs}
                    setCsvs={setCsvs}
                />
            }
        </>
    )
}


const NoSchemaDocumentPage = ({doctype, docid, setDocument, csvs, setCsvs, insertCsvs, availableCsvs}) => {
    return (<>
        {(csvs.length>0) && <>
            <CSVLoader csvs={csvs} setCsvs={setCsvs}
                insertCsvs={insertCsvs} page={DOCUMENT_VIEW} availableCsvs={availableCsvs}/>
            <p>List of exiting Csvs</p>
        </>}
        <CSVList/>
    </>)
    /*return <>
        <FileLoader docid={docid} />
        <CSVList/>
    </>*/
}




export default DocumentPage
