const TERMINUSDB=window.TERMINUSDB || {}
const base_router_win=TERMINUSDB.base_router || null

export const base_router = localStorage.getItem("terminusdb-base-router") ||  base_router_win || process.env.TERMINUSDB_APP_BASE_ROUTER || '';
//export const redirect_uri=`${window.location.origin}${base_router}`
export const redirect_uri=`${window.location.origin}`