import React from "react";
import { CREATEDB_TITLE, DBLIST_TITLE, CREATE_FIRSTDB_CSS, CREATE_FIRSTDB, DBLIST_HEADER_CSS } from './constants';
import { WOQLClientObj } from "../../init/woql-client-instance";
import { getDBListData, getDBListColumns } from './FormatDBList';
import { PageView } from '../PageView'
import { Tabs, Tab } from 'react-bootstrap-tabs';
import CreateDatabase from '../NewDatabase/CreateDatabaseView'
import { CREATE_DB_ROUTE } from "../../constants/routes"
import AccessControlErrorPage from "../../components/Reports/AccessControlErrorPage"
import ConnectionErrorPage from "../../components/Reports/ConnectionErrorPage"
import { ResultViewer } from "../../components/QueryPane/ResultViewer"
import RenderTable  from "../../components/Table/RenderTable"


const ServerHome = (props) => {
	const {woqlClient} = WOQLClientObj();
    const records = woqlClient.connection.getServerDBMetadata() || [];
    if(!records || records.length == 0){
        return (<ConnectionErrorPage />)
    }
    const dblist = records.filter(meta => meta.db != "terminus");    
    const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")
    if(dblist.length == 0 && !canCreate){
        return (<AccessControlErrorPage />)
    }

    //let lview = (dblist.length > 0 ? (<ResultViewer bindings={dblist} type="table"/>) : false)
    
    const columnConf = getDBListColumns(dblist);
    const columnData = getDBListData(dblist);
    const dataProvider = {columnData:columnData, columnConf:columnConf}
    //alert(JSON.stringify(dataProvider))
    let lview = (<RenderTable fromPage="home" dataProvider = {dataProvider} />)


    let cview = (canCreate ? (<CreateDatabase/>) : false) 

    if(!(lview && cview)){
        let content = lview || cview
        let pageHeader = (cview ? 
            (<div className={CREATE_FIRSTDB_CSS}>{CREATE_FIRSTDB}</div>) :              
            (<div className={DBLIST_HEADER_CSS}>{DBLIST_TITLE}</div>)
        )             
        
        let pageBody = (
            <div className = "container-fluid">
                <hr className = "my-space-15"/>
                {content}
            </div>
        )
        return (
            <PageView>
                { pageHeader }
                { pageBody }
            </PageView>
        )
    }

    let listTab = (
        <Tab key="dblist" label = {DBLIST_TITLE}>
            <hr className = "my-space-15"/>
            {lview}
        </Tab>
    )

    let createTab = (
        <Tab key="createdb" label = {CREATEDB_TITLE}>
            <hr className = "my-space-15"/>
            <div className = "container-fluid">
                <hr className = "my-space-15"/>
                <hr className = "my-space-15"/>
                {cview}
            </div>
        </Tab>
    )

    let otabs = ((props && props.page == CREATE_DB_ROUTE) ? [createTab, listTab] : [listTab, createTab])
    return (
        <PageView>
            <Tabs>
                {otabs}
            </Tabs>
        </PageView>
    )
}

export default ServerHome;
