import React, {useState, useEffect} from "react"
import {BiShow} from "react-icons/bi"
import {readString} from 'react-papaparse';
import {WOQLClientObj} from '../../init/woql-client-instance'
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'

export const CSVContents=({fileName, setPreview, setLoading})=>{
	const {woqlClient}=WOQLClientObj()
	const [report, setReport]=useState(false)

	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const getCsv=async(e) => {
		let name=e.target.id, update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		return await woqlClient.getCSV(fileName).then((results) =>{
			const res = readString(results, {quotes: false,
							  quoteChar: '"',
							  escapeChar: '"',
							  delimiter: ",",
							  header: true,
							  newline: "{",
							  skipEmptyLines: false,
							  columns: null
							})
			const jsonRes = res.data
			setPreview({show: true, fileName: name, data: jsonRes});
		})
		.catch((err) => process_error(err, update_start, "Failed to retrieve file " + name))
		.finally(() => setLoading(false))
	}

	return (
		<span id={fileName} onClick={getCsv} className="db-card-credit csv-act">
			<BiShow id={fileName} color="#0055bb" className='db_info_icon_spacing csv_icon_spacing '/>
			<span className="db_info" id={fileName}>Show Contents</span>
		</span>)
}
