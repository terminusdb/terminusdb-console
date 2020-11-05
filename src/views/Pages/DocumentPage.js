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
import {CSVLoader} from "../../components/CSVPane/CSVLoader"
import {CSVInput} from "../../components/CSVPane/CSVInput"
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
    const {ref, branch, graphs} = DBContextObj()

    const [happiness, setHappiness]=useState(false)
    const [csvs, setCsvs]=useState([])
    const [refreshCsvs, setRefreshCsvs]=useState([])

    const docQuery = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().document_metadata())
    const [updateQuery, report, bindings, woql] = WOQLQueryContainerHook(
        woqlClient,
        docQuery,
        branch,
        ref,
    )
    const [isSchema, setIsSchema] = useState(false)

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
                for(var key in graphs) {
					if(graphs[key].type == "schema"){
						setIsSchema(true)
						break;
					}
				}
            }
        }
    }, [report])

    const insertCsvs = (e) => {
	   for(var i=0; i<e.target.files.length; i++){
		   let files = {};
           files = e.target.files[i]
		   setCsvs( arr => [...arr, files]);
	   }
    }

    return (
        <PageView page="document" dbPage={true}>
            {!happiness && <Loading type={TERMINUS_PAGE}/>}
                <>
                    {/*<div>
                        <span className="add-csv">
                            <input type="file"
                                name="addCss"
                                id="addCss"
                                class="inputfile add-files" multiple
                                onChange={insertCsvs}
                                accept=".csv"/>

                            {(csvs.length == 0) && <label for="addCss">{ADD_CSV}</label>}
                            {(refreshCsvs.length > 0) && <label for="addCss">{ADD_MORE_CSV}</label>}
                        </span>
                    </div>*/}

                    {(csvs.length==0) && <span>
                        <CSVInput css={'add-csv'} text={ADD_CSV} onChange={insertCsvs} inputCss="add-files" multiple={true}/>
                        </span>
                    }
                    {(csvs.length>0) && <CSVLoader csvs={csvs} title={ADD_MORE_CSV} addButton={ADD_MORE_CSV} setCsvs={setCsvs}
                        insertCsvs={'add-files'} page="create"/>}

                    {(csvs.length > 0) && <CSVLoader csvs={csvs} setCsvs={setCsvs} page="document" setRefreshCsvs={setRefreshCsvs}/>}
                    {!isSchema && <CsvList/>}
                </>
            {happiness === true && (
                <DocumentList query={woql} updateQuery={updateQuery} documents={bindings} />
            )}
        </PageView>
    )
}

export default DocumentPage
