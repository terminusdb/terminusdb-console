import React, {useState, useEffect} from "react"
import {CSVLink, CSVDownload} from "react-csv";

export const CSVExport=()=>{
	const [active, setActive]=useState(false)

	const getData=()=>{
		setActive(true)
	}

	return (<>
		<button onClick={getData}>Download</button>
		{active && <CSVLink data={data}>Download me</CSVLink>}
	</>)
}
