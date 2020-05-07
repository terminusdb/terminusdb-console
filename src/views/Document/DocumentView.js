import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import TerminusClient from '@terminusdb/terminus-client';
import { WOQLTable } from '@terminusdb/terminus-react-table';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { PageView } from '../PageView'


const DocumentView = (props) => {
    const [queryResults, setQueryResults] = useState();
    const {woqlClient} = WOQLClientObj();

    const [activeQuery, setActiveQuery] = useState();

    useEffect(() => {
        const q = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().documentMetadata())
        woqlClient.query(q).then((cresults) => {
            setQueryResults(cresults)
        })
    }, []);

    function headChanged(){}

    return (
        < PageView >
            {/*<WOQLTable columns={[]} data={[]} />*/}
        </PageView>   
    )
}


export default DocumentView
