const server = localStorage.getItem("terminusdb-server-override") || process.env.TERMINUSDB_SERVER || `${window.location.protocol}//${window.location.host}/`


const TERMINUSDB=window.TERMINUSDB || {}
const user0bj=TERMINUSDB.user || {}

let key=  localStorage.getItem("terminusdb-key-override") || process.env.TERMINUSDB_KEY || user0bj.password

const userName=  localStorage.getItem("terminusdb-user-override") || process.env.TERMINUSDB_USER || user0bj.username || 'admin'

const hub_url =  localStorage.getItem("terminusdb-hub-url-override") || process.env.TERMINUS_HUB_URL //|| "https://hub-dev-server.dcm.ist/"
const bff_url =  localStorage.getItem("terminusdb-bff-url-override") || process.env.TERMINUS_BFF_URL //|| "https://hub-dev.dcm.ist/"

if(!key){
	key=window.sessionStorage.getItem("apiKey");
}

//console.log("KEY..",key)

export const localSettings = {server : server,
                              key : key,
                              user: userName,
                              remote: hub_url,
                              bff: bff_url}

