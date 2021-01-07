import TerminusClient from '@terminusdb/terminusdb-client'
import {formatBytes} from "../../utils/format"
import {formatFileDate} from '../../constants/dates'

export const validateDocId=(json)=>{
	let update_start = Date.now()
	for(var key in json){
		if(key=="@id"){
			if(json[key]==file[0].fileToUpdate){
				file.idInFile=json[key]
				return true
			}
		}
	}
}

export const checkIfDocTypeExists=(json, availableDocs)=>{
	for (const item of availableDocs.bindings) {
		if(TerminusClient.UTILS.shorten(item["Document ID"])==TerminusClient.UTILS.shorten(json["@id"]))
			return true
	}
	return false
}

export const extractFileInfo=(file)=>{
	let fJson={}
	fJson.name=file.name
	fJson.fileType=file.fileType
	fJson.action=file.action
	fJson.size=formatBytes(file.size)
	fJson.lastModified=formatFileDate(file.lastModified)
	return fJson
}
