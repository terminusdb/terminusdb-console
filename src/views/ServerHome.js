import React, { useState, useEffect } from "react";
import { serverHomeLabels, createDatabaseLabels } from '../variables/content';
import RenderTable from "../components/Table/RenderTable";
import { SERVER_HOME_PAGE } from "../variables/pageLabels"
import { WOQLClientObj } from "../init/woql-client-instance";
import { getDBListData, getDBListColumns } from '../utils/dataFormatter';
import { PageView } from './PageView'
import { Tabs, Tab } from 'react-bootstrap-tabs';

const ServerHome = (props) => {
	const {woqlClient} = WOQLClientObj();
	const [dataProvider, setDataProvider] = useState({});

	useEffect(() => {
        woqlClient.connectionConfig.clearCursor()
        const records = woqlClient.connection.getServerDBMetadata();
        const columnConf = getDBListColumns(records);
        const columnData = getDBListData(records);
        setDataProvider({columnData:columnData, columnConf:columnConf})
    }, [])

    function canCreate() {
        return woqlClient.connection.capabilitiesPermit("create_database")
    }

	return (  
        < PageView page="/home">
            <Tabs>
                <Tab label = {serverHomeLabels.title}>
                    <hr className = "my-space-15"/>
                    <div className = "container-fluid">
                        <RenderTable fromPage={SERVER_HOME_PAGE.page} dataProvider = {dataProvider} />
	    	        </div>
                </Tab>
                { canCreate() && 
                    <Tab label = {createDatabaseLabels.title}>
                        <hr className = "my-space-15"/>
                        <div className = "container-fluid">
                        {createDatabaseLabels.mainDescription}
                        </div>
                    </Tab>
                }
            </Tabs>
        </PageView>   
	)
}
export default ServerHome;
