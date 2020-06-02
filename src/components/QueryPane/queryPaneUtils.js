import TerminusClient from '@terminusdb/terminusdb-client';
export const makeWOQLFromString =(str, lang,setError)=>{
        if(lang === "json"){
            try {
                let myj = JSON.parse(str)
                return new TerminusClient.WOQL.json(myj)
            }catch(e){
                setError(e)
            }
        }
        if(lang === "js"){
            let WOQL = TerminusClient.WOQL
            try {
                var nw = eval(str)
                return nw
            }
            catch(e){
                setError(e)
            }
        }
        else if(lang == "python"){
            setError({message: "Python is not supported for editing queries through the console"})
        }
}

export const makeWOQLIntoString = (woql, lang)=>{
    if(lang === "js" || lang === "python" && woql){
        return woql.prettyPrint(lang)
    }
    else if(lang === "json" && woql){
        return JSON.stringify(woql.json(), undefined, 2);
    }
    else return ""
}