const server=process.env.TERMINUSDB_SERVER || "http://195.201.12.87:6380/" 

const TERMINUSDB=window.TERMINUSDB || {}
const user0bj=TERMINUSDB.user || {}

let key=user0bj.password || undefined

const userName=user0bj.username || 'admin'

const db=process.env.TERMINUSDB_DB || ""

if(!key){

	key=window.sessionStorage.getItem("apiKey");
}

export const localSettings = {server : server,
                              key : key,  
                              db : db}
