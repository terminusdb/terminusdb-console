/**
 * Basic status constants used broadly to identify api response categories
 */
export const TERMINUS_SUCCESS = 'success'
export const TERMINUS_ERROR = 'error'
export const TERMINUS_WARNING = 'warning'
export const TERMINUS_INFO = 'info'
export const TERMINUS_FAILURE = 'failure'
export const TERMINUS_PROTOCOL = 'terminusdb://'
export const TERMINUS_USER_DATA = 'http://hub.terminusdb.com/users/'
export const TERMINUS_USER_SCHEMA = 'http://hub.terminusdb.com/users/'

//scope for loading pages, etc
export const TERMINUS_COMPONENT = 'component'
export const TERMINUS_PAGE = 'page'
export const TERMINUS_SYSTEM = 'system'

//formats for WOQL
export const WOQL_JS = 'WOQL.js'
export const WOQL_JSON = 'JSON-LD'
export const WOQL_PY = 'WOQL.py'

//important categories of error

export const ACCESS_FAILURE = 'Access Control Failure'
export const CONNECTION_FAILURE = 'Connection Failure'
