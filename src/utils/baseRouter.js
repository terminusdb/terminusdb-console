const TERMINUSDB=window.TERMINUSDB || {}
const base_router_win=TERMINUSDB.base_router || null

export const base_router = base_router_win || process.env.TERMINUSDB_APP_BASE_ROUTER || '/console/';
export const redirect_uri=`${window.location.origin}${base_router}`