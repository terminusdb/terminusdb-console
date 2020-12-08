import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {ControlledWOQLTable } from '@terminusdb/terminusdb-react-components';

import {TERMINUS_TABLE, TERMINUS_ERROR} from "../../constants/identifiers"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {EmptyResult} from '../../components/Reports/EmptyResult'


export const ControlledTable = ({query, order, limit, freewidth, view, hook, onEmpty, onLoading, onError}) => {
    const { woqlClient} = WOQLClientObj()
    const { branch, ref, prefixes} = DBContextObj()

    const [myWOQL, setMyWOQL] = useState(query)

    useEffect(() => {
        setMyWOQL(query)
    }, [query])


    useEffect(() => {
        if((!hook || hook != "auto")){
            let nquery = TerminusClient.WOQL.query().json(myWOQL.json())//create new copy
            setMyWOQL(nquery)
        }
    }, [branch, ref])

    const _generate_context = (prefixes) => {
        let nups = {}
        for(var k in TerminusClient.UTILS.standard_urls){
            nups[k] = TerminusClient.UTILS.standard_urls[k]
        }
        for(var i = 0; i<prefixes.length; i++){
            if(prefixes[i]['Prefix'] && prefixes[i]['Prefix']['@value'] && prefixes[i]['IRI'] && prefixes[i]['IRI']["@value"]){
                nups[prefixes[i]['Prefix']['@value']] = prefixes[i]['IRI']["@value"]
            }
        }
        return nups
    }

    function myOnLoading(){
        return <Loading type={TERMINUS_TABLE} />
    }


    function myOnError(report){
        report.status = TERMINUS_ERROR
        return <TerminusDBSpeaks report={report} />
    }

    function myOnEmpty(report){
        return <EmptyResult report={report} />
    }

    function doError(report){
        if(onError) {
            let x = onError(report)
            return x || null
        }
        return myOnError(report)
    }

    function doLoading(){
        if(onLoading) {
            let x = onLoading()
            return x || null
        }
        return myOnLoading()
    }

    function doEmpty(report){
        if(onEmpty) {
            let x = onEmpty(report)
            return x || null
        }
        return myOnEmpty(report)
    }

    if(!prefixes) {
        return (onLoading ? onLoading() : null)
    }

    view.prefixes = _generate_context(prefixes)

    return <ControlledWOQLTable 
        client={woqlClient} 
        freewidth={freewidth}
        rows={limit}
        order={order} 
        query={myWOQL} 
        onLoading={doLoading} 
        view={view}
        onError={doError}
        onEmpty={doEmpty}
    />
}
