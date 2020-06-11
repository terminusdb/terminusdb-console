const server = process.env.TERMINUSDB_SERVER || `${window.location.protocol}//${window.location.host}`

const TERMINUSDB=window.TERMINUSDB || {}
const user0bj=TERMINUSDB.user || {}

let key=process.env.TERMINUSDB_KEY || user0bj.password 

const userName=process.env.TERMINUSDB_USER || user0bj.username || 'admin'

if(!key){
	key=window.sessionStorage.getItem("apiKey");
}

export const localSettings = {server : server, key : key}

