import React, {useState, useEffect} from "react"
import {BiShow} from "react-icons/bi"

export const CSVContents=({getCsv, fileName})=>{
	return (
		<span id={fileName} onClick={getCsv} className="db-card-credit csv-act">
			<BiShow id={fileName} color="#0055bb" className='db_info_icon_spacing csv_icon_spacing '/>
			<span className="db_info" id={fileName}>Show Contents</span>
		</span>)
}
