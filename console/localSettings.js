
console.log("____TERMINUSDB_SERVER",process.env.TERMINUSDB_SERVER);

const server=process.env.TERMINUSDB_SERVER || "http://localhost:6363" 

const user0bj=window.user || {}

let key=user0bj.password || undefined

const userName=user0bj.username || 'admin'

const db=process.env.TERMINUSDB_DB || ""

if(!key){

	key=window.sessionStorage.getItem("apiKey");
	console.log("___sessionkey__",key)
}

export const localSettings = {server : server,
                              key : key,  
                              db : db}
