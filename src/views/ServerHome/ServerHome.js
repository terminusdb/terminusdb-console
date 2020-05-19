import React, { useState, useEffect } from "react";
import { serverHomeConstants, createDatabaseConstants } from './constants';
import RenderTable from "../../components/Table/RenderTable";
import { SERVER_HOME_PAGE } from "../../variables/pageLabels"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { getDBListData, getDBListColumns } from './FormatDBList';
import { PageView } from '../PageView'
import { Tabs, Tab } from 'react-bootstrap-tabs';
import CreateDatabase from '../NewDatabase/CreateDatabaseView'
import { CREATE_DB_ROUTE } from "../../constants/routes"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import TerminusClient from '@terminusdb/terminusdb-client';
import { isObject } from "../../utils/helperFunctions"

const ServerHome = (props) => {
	const {woqlClient} = WOQLClientObj();
	const [dataProvider, setDataProvider] = useState({});

	useEffect(() => {
        woqlClient.connectionConfig.clearCursor()
        const records = woqlClient.connection.getServerDBMetadata();
		const vw = TerminusClient.View.table();
		const vwr = vw.row();
		//console.log('dataProvider', dataProvider)
		//setDataProvider({bindings: records, config: vwr})
        const columnConf = getDBListColumns(records);
        const columnData = getDBListData(records);
        setDataProvider({columnData:columnData, columnConf:columnConf})
    }, [])

    const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")

    const active_page = ((props && props.page == CREATE_DB_ROUTE && canCreate ) ?  createDatabaseConstants.page : serverHomeConstants.page )

	//console.log('dataProvider', dataProvider)

	return (
        <PageView page="/home">
            <Tabs activeKey={active_page}>
                <Tab eventKey={serverHomeConstants.page} label = {serverHomeConstants.title}>
                    <hr className = "my-space-15"/>
                    <div className = "container-fluid server-home-table">
                        {<RenderTable fromPage={SERVER_HOME_PAGE.page} dataProvider = {dataProvider} />}
						{/*isObject(dataProvider) && <ResultViewer type="table" viewConfig={dataProvider.config} bindings={dataProvider.bindings}/>*/}
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
