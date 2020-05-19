
console.log("____TERMINUSDB_SERVER",process.env.TERMINUSDB_SERVER);

const server=process.env.TERMINUSDB_SERVER || "http://localhost:6363"
const key=window.TERMINUSDB_PASSWORD || undefined //process.env.TERMINUSDB_KEY || undefined
const userName=window.TERMINUSDB_USER || process.env.TERMINUSDB_USER || 'admin'
const db=process.env.TERMINUSDB_DB || ""

export const localSettings = {server : server,
                              key : key,  
                              db : db}
