import { isObject } from "./helperFunctions"
import * as tag from "../labels/tags"

export const getCommitControl = (wr, cid, setParent, setChild, setCurrentCommitMsg) => {
    if(!isObject(wr)) return tag.BLANK;
    let results = wr.first();
    if(results){
		let t = results['Time']["@value"]
		let author = results['Author']["@value"]
		let message = results['Message']["@value"]
		let parent = results['Parent']["@value"]
		let child = results['Child']["@value"]

        if(parent) setParent(parent)
        if(child) setChild(child)

		var date = timeConverter(t)
		let str = " (" + cid + ") Updated by " + author + " on " + date;
        setCurrentCommitMsg(str);
        return str;
    }

    return tag.BLANK;
}

function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	return time;
}
