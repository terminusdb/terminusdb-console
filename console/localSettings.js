const server = localStorage.getItem("terminusdb-server-override") || process.env.TERMINUSDB_SERVER || `${window.location.protocol}//${window.location.host}/`


const TERMINUSDB=window.TERMINUSDB || {}
const user0bj=TERMINUSDB.user || {}

let key=process.env.TERMINUSDB_KEY || user0bj.password

const userName=process.env.TERMINUSDB_USER || user0bj.username || 'admin'

const hub_url = process.env.TERMINUS_HUB_URL //|| "https://hub-dev-server.dcm.ist/"
const bff_url = process.env.TERMINUS_BFF_URL //|| "https://hub-dev.dcm.ist/"

if(!key){
	key=window.sessionStorage.getItem("apiKey");
}

//console.log("KEY..",key)

export const localSettings = {server : server,
                              key : key,
                              user: userName,
                              remote: hub_url,
                              bff: bff_url}

