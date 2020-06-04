const server=process.env.TERMINUSDB_SERVER || "http://localhost:6363/" 

const TERMINUSDB=window.TERMINUSDB || {}
const user0bj=TERMINUSDB.user || {}

console.log("TERMINUSDB_KEY",process.env.TERMINUSDB_KEY);
console.log("user0bj.password",user0bj.password);


let key=process.env.TERMINUSDB_KEY || user0bj.password || undefined

const userName=user0bj.username || 'admin'

const db=process.env.TERMINUSDB_DB || ""

if(!key){

	key=window.sessionStorage.getItem("apiKey");
}

export const localSettings = {server : server,
                              key : key,  
                              db : db}
