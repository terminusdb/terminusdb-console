import * as vios from "./constants.vios"
import TerminusClient from '@terminusdb/terminusdb-client'

function formMessageObject(item) {
	let obj={}
	for (var key in item) {
		switch(key){
			case vios.WITNESS_TYPE:
				obj.type=item[key]
				break
			case vios.WITNESS_PROPERTY:
				var val=item[key]["@value"]
				if(val==undefined)
					obj.property=`${TerminusClient.UTILS.shorten(item[key])}`
				else
					obj.property=val
				break
			case vios.WITNESS_CLASS:
				obj.class=item[key]["@value"]
				break
			case vios.WITNESS_BASE_TYPE:
				obj.baseType= `${TerminusClient.UTILS.shorten(item[key]["@value"])}`
				break
			case vios.WITNESS_LITERAL:
				obj.literal=item[key]["@value"]
				break
            case vios.WITNESS_MESSAGE:
				obj.message=item[key]
				break
			case vios.WITNESS_SUBJECT:
				var val=item[key]["@value"]
				if(val==undefined)
					obj.subject=`${TerminusClient.UTILS.shorten(item[key])}`
				else
					obj.subject=`${TerminusClient.UTILS.shorten(val)}`
				break
			case vios.WITNESS_PARENT_TYPE:
				obj.parent=`${TerminusClient.UTILS.shorten(item[key]["@value"])}`
				break
			default:
				//console.log("Invalid Witness key " + key + " found in SystemError.js")
				break
		}
	}
	return obj
}

export const parseWitnesses = (wit) => {
	let witObj={}, msgArray=[], constructedMsg=""
	wit.map(item => {
		constructedMsg=""
		witObj=formMessageObject(item)
		switch(witObj.type){
			case vios.VIOLATION_WITH_DATA_TYPE_OBJECT:
				constructedMsg= constructedMsg + constructDataTypeObjectVio(witObj)
				break
			case vios.VIOLATION_UNTYPED_INSTANCE:
				constructedMsg= constructedMsg + constructUntypedInstanceVio(witObj)
				break
			case vios.VIOLATION_DATA_TYPE_SUBSUMPTION:
				constructedMsg= constructedMsg + constructDataTypeSubsumtionVio(witObj)
				break
			case vios.VIOLATION_INVALID_CLASS_VIOLATION:
			case vios.VIOLATION_CLASS_INHERITANCE:
				if(witObj.class) {
					constructedMsg= constructedMsg + constructClassVio(witObj)
				}
				break
			case vios.VIOLATION_PROPERTY_WITH_UNDEFINED_DOMAIN:
				if(witObj.property){
					constructedMsg=constructedMsg + constructPropertyVio(witObj)
				}
				break
			case vios.VIOLATION_CLASS_CYCLE:
			case vios.VIOLATION_INVALID_CLASS_IN_RANGE:
				constructedMsg=constructedMsg + constructMessageValueVio(witObj)
				break
			default:
				constructedMsg = constructedMsg + constructDefaultVio(witObj)
				break
		}
		msgArray.push(constructedMsg)
	})
	return msgArray
}

export const parseAPIMessage = (apiMsg) => {
	if(apiMsg.includes(vios.VIOLATION_WOQL_SYNTAX_ERROR))
		return "Syntax error found"
	else if (apiMsg.includes(vios.VIOLATION_KEY_HAS_UNKNOWN_PREFIX))
		return "Key has unknown prefix"
	else return apiMsg
}

function constructDataTypeObjectVio (msgObject) {
	let text=""
	text=text + ". " + msgObject.literal + " is " + msgObject.message + " for "
	if(msgObject.property) {
		text=text + " Property " + `${TerminusClient.UTILS.shorten(msgObject.property)}`
	}
	text=text + " of type " + msgObject.baseType
	return text
}

function constructUntypedInstanceVio(msgObject) {
	let text=""
	text=text + " for "
	if(msgObject.property) {
		text=text + " Property " + `${TerminusClient.UTILS.shorten(msgObject.property)}`
    }
    console.log("message object ", msgObject)
	text=text + ". " //+ msgObject.message["@value"]
	return text
}

function constructDataTypeSubsumtionVio (msgObject) {
	let text=""
	text=text + " for document " + msgObject.subject + ". "
	if(msgObject.property) {
		text=text + "Expecting type " + msgObject.baseType + " for property " + msgObject.property + ". "
	}
	return text
}

function constructClassVio (msgObject) {
	let m=msgObject.message["@value"], rep="", text=""
	if(m.includes(msgObject.class)) {
		rep=m.replace(msgObject.class, `${TerminusClient.UTILS.shorten(msgObject.class)}`)
	}
	text=text + ". " + rep
	return text
}

function constructPropertyVio (msgObject) {
	let m=msgObject.message["@value"], rep="", text=""
	if(m.includes(msgObject.property)) {
		rep=m.replace(msgObject.property, `${TerminusClient.UTILS.shorten(msgObject.property)}`)
	}
	text=text + ". " + rep
	return text
}

function constructMessageValueVio (msgObject) {
	let text=""
	text = text + ". " + msgObject.message["@value"]
	return text
}

function constructDefaultVio (msgObject) {
	let val=msgObject.message["@value"], text=""
	if(val==undefined)
		text= text + ". " + msgObject.message
	else text= text + ". " + val
	return text
}

export const constructErrorMessage = (error) => {
	let msgObject={}

	// parse witnesses
	if(error.data["api:error"] && (error.data["api:error"]["api:witnesses"] || error.data["api:error"]["api:witness"])) {
		if(error.data["api:error"]["api:witnesses"] == undefined){
			let witness=error.data["api:error"]["api:witness"]
			msgObject=formMessageObject(witness)
			let defaultMsg=constructDefaultVio(msgObject)
			return [defaultMsg]
		}
		else {
			let witnesses=error.data["api:error"]["api:witnesses"]
			return parseWitnesses(witnesses)
		}

	}
	return;
}

export const constructErrorJson = (error) => {
	let eJson=[]
	if(error.data["api:error"] && (error.data["api:error"]["api:witnesses"] || error.data["api:error"]["api:witness"])) {
		if(error.data["api:error"]["api:witnesses"] == undefined){
			let witness=error.data["api:error"]["api:witness"]
			eJson.push(witness)
		}
		else {
			let witnesses=error.data["api:error"]["api:witnesses"]
			eJson = witnesses
		}
	}
	else if (error.data["api:error"]){
        let er = error.data["api:error"]
        er["api:message"] = error.data["api:message"]
        eJson.push(er)
	}
	return eArray
}
