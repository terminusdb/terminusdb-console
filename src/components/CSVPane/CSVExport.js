import React, {useState, useEffect} from "react"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {readString} from 'react-papaparse';
import Loading from '../../components/Reports/Loading'
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'

export const CSVExport=({fileName, getCsv, loading})=>{
	const {woqlClient}=WOQLClientObj()

	return (<>
		{loading &&  <Loading type={TERMINUS_COMPONENT} />}
		<button onClick={(e)=>getCsv(e, true)} id={fileName}>Download</button>
	</>)
}
