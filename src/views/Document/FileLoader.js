import React, {useState, useEffect} from 'react'
import {CSVLoader} from "../../components/CSVPane/CSVLoader"
import {CSVInput} from "../../components/CSVPane/CSVInput"
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {ADD_CSV, ADD_MORE_CSV, ADD_MORE_CSV_TITLE} from './constants.document'
import {DOCUMENT_VIEW} from "../../components/CSVPane/constants.csv"

export const FileLoader = ({adding}) => {
    const [csvs, setCsvs]=useState([])
    const [availableCsvs, setAvailableCsvs]=useState([])
    const {woqlClient}=WOQLClientObj()

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

    useEffect(() => {
        if(adding){
            if(csvs && csvs.length > 0) adding(true)
            else adding(false)
        }
    }, [csvs])

    return (<>
        {(csvs.length==0) && <span>
            <CSVInput css={'add-csv'} text={ADD_CSV} onChange={insertCsvs} inputCss="add-files" multiple={true}/>
        </span>}
        {(csvs.length>0) && <CSVLoader csvs={csvs} title={ADD_MORE_CSV_TITLE} addButton={ADD_MORE_CSV} setCsvs={setCsvs}
            insertCsvs={insertCsvs} page={DOCUMENT_VIEW} availableCsvs={availableCsvs}/>}
        </>
    )
}
