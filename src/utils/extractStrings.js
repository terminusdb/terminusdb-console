export const stripDocFromUrl = (url) =>{
    if(url.includes('doc:'))
       return url.substring(4);
    return url;
}

export const getNameFromUrl = (url)=>{
   return url.substring(url.lastIndexOf('/')+1)
}

export const getNameFromVariable = (url)=>{
    var name = url.substring(url.lastIndexOf('/')+1);
    if(name.includes('v:'))
        return name.substring(2);
    return name;
}

export const formatColumnNames = (v) => {
    var formattedStr;
    if(v.includes(':'))
        formattedStr = v.substring(v.lastIndexOf(':')+1);
    else if(v.includes('@'))
        formattedStr = v.substring(v.lastIndexOf('@')+1);
    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1)
}
