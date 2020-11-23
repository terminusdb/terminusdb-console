import React, {useState, useEffect} from 'react'
import {ADD_CSV, ADD_MORE_CSV, ADD_MORE_CSV_TITLE} from './constants.document'
import {DOCUMENT_VIEW} from "../../components/CSVPane/constants.csv"
import {CSVInput} from '../../components/CSVPane/CSVInput'

export const FileLoader = ({adding, csvs, setCsvs, insertCsvs}) => {
    useEffect(() => {
        if(adding){
            if(csvs && csvs.length > 0) adding(true)
            else adding(false)
        }
    }, [csvs])

    return (<>
            {(csvs.length==0) &&
                <CSVInput css={'add-csv add-csv-subheader'} text={ADD_CSV} onChange={insertCsvs} inputCss="add-files" multiple={true}/>
            }
            {(csvs.length>0) &&
                <CSVInput text={ADD_MORE_CSV} onChange={insertCsvs} css={"add-csv add-csv-subheader"} inputCss="add-files" multiple={true}/>
            }
        </>
    )
}
