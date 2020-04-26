import React, { useState, useEffect } from 'react';
import Loading from "../../components/Loading";
import { Card, CardText, CardBody }  from "reactstrap";
import RenderTable from "../../components/RenderTable";
import { getColumnsForTable, getBindingData } from '../../utils/dataFormatter';
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import TerminusClient from '@terminusdb/terminus-client';


export const Classes = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [dataProvider, setDataProvider] = useState()
    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    useEffect(() => {
        if(props.graph && (!filter || filter.gid != props.graph.gid || filter.type != props.graph.type ))
        setFilter(props.graph)
    }, [props.graph])

    useEffect(() => {
        if(filter){
            let gstr = filter.type + "/" + filter.gid
            const q = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().classList(gstr))
            dbClient.query(q).then((cresults) => {
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
