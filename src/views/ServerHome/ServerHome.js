import React, { useState, useEffect } from "react";
import { serverHomeConstants, createDatabaseConstants } from './constants';
import RenderTable from "../../components/Table/RenderTable";
import { SERVER_HOME_PAGE } from "../../variables/pageLabels"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { getDBListData, getDBListColumns } from '../../utils/dataFormatter';
import { PageView } from '../PageView'
import { Tabs, Tab } from 'react-bootstrap-tabs';
import CreateDatabase from '../NewDatabase/CreateDatabaseView'
import { CREATE_DB_ROUTE } from "../../components/Router/constants"

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

    const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")
    

    const active_page = ((props && props.page == CREATE_DB_ROUTE && canCreate ) ?  createDatabaseConstants.page : serverHomeConstants.page )

	return (
        <PageView page="/home">
            <Tabs activeKey={active_page}>
                <Tab eventKey={serverHomeConstants.page} label = {serverHomeConstants.title}>
                    <hr className = "my-space-15"/>
                    <div className = "container-fluid">
                        <RenderTable fromPage={SERVER_HOME_PAGE.page} dataProvider = {dataProvider} />
	    	        </div>
                </Tab>
                { canCreate &&
                    <Tab eventKey={createDatabaseConstants.page} label = {createDatabaseConstants.title}>
                        <hr className = "my-space-15"/>
                        <div className = "container-fluid">
                            <hr className = "my-space-15"/>
                            <hr className = "my-space-15"/>
                            <CreateDatabase/>
                        </div>
                    </Tab>
                }
            </Tabs>
        </PageView>
	)
}
export default ServerHome;
