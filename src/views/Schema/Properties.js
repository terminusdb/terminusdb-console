import React, { useState, useEffect } from 'react';
import { Card, CardText, CardBody }  from "reactstrap";
import RenderTable from "../../components/RenderTable";
import { getColumnsForTable, getBindingData } from '../../utils/dataFormatter';
import TerminusClient from '@terminusdb/terminus-client';
import Loading from "../../components/Loading";
import { WOQLClientObj } from "../../init/woql-client-instance";


export const Properties = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [dataProvider, setDataProvider] = useState()
    const {woqlClient} = WOQLClientObj();  

    useEffect(() => {
        if(props.graph && (!filter || filter.gid != props.graph.gid || filter.type != props.graph.type ))
        setFilter(props.graph)
    }, [props.graph])

    useEffect(() => {
        if(filter){
            let gstr = filter.type + "/" + filter.gid
            let q = TerminusClient.WOQL.limit(100).start(0, TerminusClient.WOQL.lib().propertyMetadata(gstr))
            woqlClient.query(q).then((cresults) => {
                let cwr = new TerminusClient.WOQLResult(cresults, q)
                let resultData = cwr.getBindings();
                const columnConf = getColumnsForTable(resultData);
                const columnData = getBindingData(resultData);
                setDataProvider({columnData:columnData, columnConf:columnConf});            
            })
        }
    }, [props.rebuild, filter]);

    return (
        <div className = "tab-co">
            <Card>
                <CardBody>
                    {dataProvider && 
                    <RenderTable dataProvider = {dataProvider}/>
                    }
                    {!dataProvider &&
                    <Loading /> 
                    }
                 </CardBody>
            </Card>
        </div>
    )
}
