import TerminusClient from '@terminusdb/terminusdb-client';
export const makeWOQLFromString =(str, lang)=>{
        switch(lang){
            case "json":
                 const myj = JSON.parse(str)
                 return new TerminusClient.WOQL.json(myj)
            case "js":
                 const WOQL = TerminusClient.WOQL
                 let prelude = WOQL.emerge()
                 var nw = eval(prelude + "\n" + str)
                 //nw = eval(str)
                 return nw;
            case "python":
                throw "Python is not supported for editing queries through the console";
        }
    }
        /*
        if(lang === "json"){
           const myj = JSON.parse(str)
                 return new TerminusClient.WOQL.json(myj)

            }catch(e){
                console.log(e)
                setError(e)
                return false;
            }
        }
        if(lang === "js"){
            let WOQL = TerminusClient.WOQL
            try {
                var nw = eval(str)
                return nw
            }
            catch(e){
                console.log(e)
                setError(e)
                return false;
            }
        }
        else if(lang == "python"){
            setError({message: "Python is not supported for editing queries through the console"})
            return false;
        }*/


export const makeWOQLIntoString = (woql, lang)=>{
    if(lang === "js" || lang === "python" && woql){
        return woql.prettyPrint(lang)
    }
    else if(lang === "json" && woql){
        return JSON.stringify(woql.json(), undefined, 2);
    }
    else return ""
}
