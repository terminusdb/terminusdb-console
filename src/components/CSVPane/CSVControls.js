import React, {useState, useEffect} from "react"
import * as act from "./constants.csv"
import {BiShow} from "react-icons/bi"
import {AiOutlineDelete} from "react-icons/ai"
import {AiOutlineArrowDown} from "react-icons/ai"

export const CSVControls=({action, color, fileName, onClick, loading})=>{
	return (<>
		{loading &&  <Loading type={TERMINUS_COMPONENT} />}
		{(action==act.SHOW) && <>
			<span id={fileName} onClick={(e)=>onClick(e)} className="db-card-credit csv-act">
				<BiShow id={fileName} color={color} className='db_info_icon_spacing csv_icon_spacing '/>
				<span className="db_info" id={fileName}>{action}</span>
			</span>
		</>}
		{(action==act.DOWNLOAD) && <>
			<span id={fileName} onClick={(e)=>onClick(e, true)} className="db-card-credit csv-act">
				<AiOutlineArrowDown id={fileName} color={color} className='db_info_icon_spacing csv_icon_spacing '/>
				<span className="db_info" id={fileName}>{action}</span>
			</span>
		</>}
		{(action==act.REMOVE) && <>
			<span id={fileName} onClick={(e)=>onClick(e)} className="db-card-credit csv-act">
				<AiOutlineDelete id={fileName} color={color} className='db_info_icon_spacing csv_icon_spacing '/>
				<span className="db_info" id={fileName}>{action}</span>
			</span>
		</>}
	</>)

}
