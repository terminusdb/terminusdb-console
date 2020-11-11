import React, {useState, useEffect} from 'react'
import {CSVLoader} from "../../components/CSVPane/CSVLoader"
import {ADD_CSV, ADD_MORE_CSV} from './constants.document'

export const FileLoader = ({adding}) => {
    const [csvs, setCsvs]=useState([])
    const [refreshCsvs, setRefreshCsvs]=useState([])

    const insertCsvs = (e) => {
        for(var i=0; i<e.target.files.length; i++){
            let files = {};
            files = e.target.files[i]
            const q=TerminusClient.WOQL.limit(50,
                TerminusClient.WOQL.triple('v:Type', 'type', 'scm:CSV').triple('v:Type', 'label', 'v:name'))
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
    
    /*
    const insertCsvs = (e) => {
        for(var i=0; i<e.target.files.length; i++){
            let files = {};
            files = e.target.files[i]
            setCsvs( arr => [...arr, files]);
        }
     }*/
     
     useEffect(() => {
        if(adding){
            if(csvs && csvs.length > 0) adding(true)
            else adding(false)
        }
     }, [csvs])

     return (<>    
     <div>
        <span className="add-csv">
            <input type="file"
                name="addCss"
                id="addCss"
                className="inputfile add-files" multiple
                onChange={insertCsvs}
                accept=".csv"/>
    
            {(csvs.length == 0) && <label htmlFor="addCss">{ADD_CSV}</label>}
            {(csvs.length > 0 || refreshCsvs.length > 0) && <label htmlFor="addCss">{ADD_MORE_CSV}</label>}
        </span>
        </div>
        {(csvs.length > 0) && 
            <CSVLoader csvs={csvs} setCsvs={setCsvs} page="document" setRefreshCsvs={setRefreshCsvs}/> 
        }
    </>
    )
}

