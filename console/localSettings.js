
console.log("____TERMINUSDB_SERVER",process.env.TERMINUSDB_SERVER);

const server=process.env.TERMINUSDB_SERVER || "http://localhost:6363"
const key=process.env.TERMINUSDB_KEY || "root"
const db=process.env.TERMINUSDB_DB || ""

export const localSettings = {server : server,
                              key : key,
                              db : db}
