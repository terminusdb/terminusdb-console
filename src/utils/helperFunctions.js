import {readString} from 'react-papaparse';
import {CSV_FILE_TYPE, JSON_FILE_TYPE, JSON_LD_FILE_TYPE} from "../components/CSVPane/constants.csv.js"

export const isObject = (obj) => {
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return true
    }
    return false
}

export const isArray = (arr) => {
    if (Array.isArray(arr) && arr.length) return true
    return false
}

export const getCurrentDBID = (client) => {
    if (isObject(client)) {
        return client.db()
    } else return false
}

export const trimContent = (str, limit) => {
    if (str && str.length > limit) {
        const toShow = str.substring(0, limit) + '...'
        return toShow
    } else return str
}

export const getCurrentDBName = (client) => {
    if (isObject(client)) {
        const dbRec = client.connection.getDBMetadata(client.db(), client.organization())
        if (isObject(dbRec)) return dbRec.title
        else return false
    } else return false
}

export const getCurrentDbDescr = (client) => {
    if (isObject(client)) {
        const dbRec = client.connection.getDBMetadata(client.db(), client.organization())
        if (isObject(dbRec)) return dbRec.description
        else return false
    } else return false
}

export const getCurrentSchema = (client) => {
    if (isObject(client)) {
        return client.server() + '/' + client.db() + '/schema'
    } else return false
}

export const resetDB = (client) => {
    if (isObject(client)) {
        return client.connectionConfig.clearCursor()
    }
}

export const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000)
    var months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    var year = a.getFullYear()
    var month = months[a.getMonth()]
    var date = a.getDate()
    var hour = a.getHours()
    var min = a.getMinutes()
    var sec = a.getSeconds()
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
    return time
}

export const validURL = (url) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(url);
 }

export const readLines=(file, maxlines, forEachLine, onComplete)=> {
    var CHUNK_SIZE = 50000;
    var decoder = new TextDecoder();
    var offset = 0;
    var linecount = 0;
    var linenumber = 0;
    var results = '';
    var fr = new FileReader();
    fr.onload = function() {
        results += decoder.decode(fr.result, {stream: true});
        var lines = results.split('\n');
        results = lines.pop();
        linecount += lines.length;
        if (linecount > maxlines) {
            lines.length -= linecount - maxlines;
            linecount = maxlines;
        }
        for (var i = 0; i < lines.length; ++i) {
            forEachLine(lines[i] + '\n');
        }
        offset += CHUNK_SIZE;
        seek();
    };
    fr.onerror = function() {
        onComplete(fr.error);
    };
    seek();
    function seek() {
        if (linecount === maxlines) {
            onComplete();
            return;
        }
        if (offset !== 0 && offset >= file.size) {
            forEachLine(results);
            onComplete();
            return;
        }
        var slice = file.slice(offset, offset + CHUNK_SIZE);
        fr.readAsArrayBuffer(slice);
    }
}

export const convertStringsToJson=(str)=>{
    const res = readString(str, {quotes: false,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ",",
        header: true,
        newline: "{",
        skipEmptyLines: false,
        columns: null
        })
    return res.data
}

export const getFileType=(filename)=>{
    let ext=filename.split('.').pop();
    switch (ext){
        case CSV_FILE_TYPE:
            return CSV_FILE_TYPE
        case JSON_FILE_TYPE:
            return JSON_FILE_TYPE
        case JSON_LD_FILE_TYPE:
            return JSON_FILE_TYPE
        default:
            console.log("Invalid file type")
            return
    }
}

/*a plain js function to copy to clipboard*/
export const copyToClipboard = str => {
   const el = document.createElement('textarea');
   el.value = str;
   document.body.appendChild(el);
   el.select();
   document.execCommand('copy');
   document.body.removeChild(el);
 }
