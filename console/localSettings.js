
console.log("____TERMINUSDB_SERVER",process.env.TERMINUSDB_SERVER);

const server=process.env.TERMINUSDB_SERVER || "http://195.201.12.87:6380/"
const key=process.env.TERMINUSDB_KEY || "root"
const db=process.env.TERMINUSDB_DB || ""

export const localSettings = {server : server,//"http://localhost:6363",
                              key : key,
                              db : db}
