/**
 * 
 * Simple functions which effectively compose constants - these are global so we can ensure we always compose important constants in the same way 
 * 
 */
import {TERMINUS_USER_DATA, TERMINUS_USER_SCHEMA, TERMINUS_PROTOCOL} from "./identifiers"

     //should be moved out into general settings
export const getDefaultDocURL = (aid, did, on_hub) => {
    let base = (on_hub ? TERMINUS_PROTOCOL : TERMINUS_PROTOCOL)
    return base + "data/"
    //return `${base}${aid}/${did}/data/`
}

export const getDefaultScmURL = (aid, did, on_hub) => {
    let base = (on_hub ? TERMINUS_PROTOCOL : TERMINUS_PROTOCOL)
    return base + "schema#"
    //return `${base}${aid}/${did}/schema#`
}