import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {PageView} from '../Templates/PageView'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {DOCUMENT_NO_SCHEMA, SYSTEM_ERROR, NO_DOCUMENT, NO_DOCUMENT_CLASS, ADD_CSV, ADD_MORE_CSV} from './constants.pages'
import {DocumentList} from '../Tables/DocumentList'
import {CsvList} from '../Tables/CsvList'
import {DBContextObj} from '../../components/Query/DBContext'
import {TERMINUS_PAGE} from '../../constants/identifiers'
import {DataLoader} from "../../components/Form/DataLoader"
import {CsvLoader} from "../../components/Form/CsvLoader"
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {Row, Col} from "reactstrap"

const DocumentPage = (props) => {
    /*
     * global woqlClient obj
     */
    const {woqlClient} = WOQLClientObj()
    const {ref, branch} = DBContextObj()

    const [happiness, setHappiness]=useState(false)
    const [csvs, handleCsvs]=useState([])
	const [csvCommit, setCsvCommit] = useState("Adding csvs ...")

    const docQuery = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().document_metadata())
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery,
        branch,
        ref,
    )

    const [csvReport, setCsvReport] = useState()
    const [loading, setLoading] = useState(false)

    function interpretQueryError(report) {
        setHappiness(NO_DOCUMENT)
        const hasSchemaGraph = TerminusClient.WOQL.lib().loadBranchGraphNames(woqlClient)
        woqlClient
            .query(hasSchemaGraph)
            .then((results) => {
                if (results.bindings && results.bindings.length) {
                    let found = false
                    for (var i = 0; i < results.bindings.length; i++) {
                        let res = results.bindings[0]
                        if (res['SchemaName']['@value']) {
                            found = true
                            continue
                        }
                    }
                    if (!found) {
                        setHappiness(DOCUMENT_NO_SCHEMA)
                    }
                }
            })
            .catch((e) => {
                setHappiness(SYSTEM_ERROR)
            })
    }

    /*function doRebuild(){
        updateQuery(docQuery)
    }*/

    function interpretEmptyResult() {
        const hasClasses = TerminusClient.WOQL.lib().concrete_document_classes()
        woqlClient
            .query(hasClasses)
            .then((dresults) => {
                if (dresults.bindings && dresults.bindings.length > 1) {
                    setHappiness(NO_DOCUMENT)
                } else {
                    setHappiness(NO_DOCUMENT_CLASS)
                }
            })
            .catch((e) => {
                setHappiness(SYSTEM_ERROR)
            })
    }

    useEffect(() => {
        if (report) {
            if (report.error || report == 'error') {
                interpretQueryError(report)
            } else if (report.rows == 0) {
                interpretEmptyResult()
            } else {
                setHappiness(true)
            }
        }
    }, [report])


    function process_error(err, update_start, message){
        setCsvReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

    const handleUpload = () => {
        let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
        //console.log('csvs on upload', csvs)
        return woqlClient.insertCSV(csvs, csvCommit, null, null).then((results) => {
			let rep = {status: TERMINUS_SUCCESS, message: "Successfully uploaded files"}
            setCsvReport(rep)
		})
		.catch((err) => process_error(err, update_start, "Failed to upload file"))
        .finally(() => setLoading(false))
    }

    return (
        <PageView page="document" dbPage={true}>
            {!happiness && <Loading type={TERMINUS_PAGE}/>}

            <CsvLoader actionText={ADD_CSV} secondActionText={ADD_MORE_CSV} handleCsvs={handleCsvs} page="document"/>

            {(csvs.length>0) && <>
                <Col md={5}>
                    <input class="commit-log-input" type="text"
                        placeholder="Enter message for commit log" width="40"
                        onChange={(e) => setCsvCommit(e.target.value)}/>
                </Col>
                {/*<Col md={3}>
                    <button className="tdb__button__base tdb__button__base--bgreen upload-file"
                        onClick={handleUpload}>Upload Data</button>
                </Col>*/}
            </>}

            <Row className="generic-message-holder">
                {csvReport &&
                    <TerminusDBSpeaks report={csvReport} />
                }
            </Row>

            <hr/>

            {/*<DataLoader/>*/}

            <CsvList/>

            {happiness === true && (
                <DocumentList query={woql} updateQuery={updateQuery} documents={bindings} />
            )}
            {/*happiness && happiness !== true && (
                <TerminusDBSpeaks failure={happiness} report={report}/>
            )*/}
        </PageView>
    )
}

export default DocumentPage
