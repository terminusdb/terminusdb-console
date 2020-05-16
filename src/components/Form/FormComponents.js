import { read_object } from "@terminusdb/terminusdb-client/lib/woql"

/**
* Library of Terminus Console (TC) form patterns
*/
Import React from 'react'

export TCForm = ({onSubmit, elements}) => {

}


const onSubmit = (data) => {
    
    data.accountid = data.accountid || woqlClient.account() || woqlClient.uid()
    if(!data.data_url || data.data_url == "default"){
        data.data_url = getDefaultDocURL(data.accountid, data.dbid, (dbLocation === CREATE_TERMINUS_DB))
    }
    if(!data.schema_url || data.schema_url == "default"){
        data.schema_url = getDefaultScmURL(data.accountid, data.dbid, (dbLocation === CREATE_TERMINUS_DB))
    }
    let doc = {
        label: data.dbname,
        comment: data.description,
        base_uri: data.data_url,
        prefixes: {scm: data.schema_url}
    }
    setLoading(true)
    doCreate(data.dbid, doc, data.accountid, data.schema, data.instance)
}
