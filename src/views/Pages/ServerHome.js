import React, { useEffect, useState } from "react";
import { CREATEDB_TITLE, DBLIST_TITLE, CREATE_FIRSTDB_CSS, CREATE_FIRSTDB, DBLIST_HEADER_CSS } from './constants.pages';
import { CONNECTION_FAILURE, ACCESS_FAILURE } from "../../constants/identifiers"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { SimplePageView } from '../Templates/SimplePageView'
import { TabbedPageView } from '../Templates/TabbedPageView'
import { CreateDatabase } from '../CreateDB/CreateDatabase'
import { CREATE_DB_ROUTE, SERVER_ROUTE } from "../../constants/routes"
import { DBList } from "../Tables/DBList"
import { LoadDatabaseListDetails } from "../../components/Query/QueryLoaders"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"

const ServerHome = (props) => {
	const {woqlClient} = WOQLClientObj();
    const records = woqlClient.connection.getServerDBMetadata() || [];
    if(!records || records.length == 0){
        return (<TerminusDBSpeaks failure={CONNECTION_FAILURE} />)
    }
    const dblist = records.filter(meta => meta.db != "terminus");
    const canCreate =  woqlClient.connection.capabilitiesPermit("create_database")
    if(dblist.length == 0 && !canCreate){
        return (<TerminusDBSpeaks failure={ACCESS_FAILURE} />)
    }

    const [dbs, setdbs] = useState(dblist)

    const [dbDetails, report] = LoadDatabaseListDetails(dblist)

    useEffect(() => {
        if(dbDetails) setdbs(dbDetails)
        if(report) console.log("Failed to load database list details", report)
    }, [dbDetails, report])

	//temp
	function onHeadChange(){
        //setRebuild(rebuild+1)
    }

    if(canCreate && dblist.length == 0){  //single page view - no tab
        return (
            <SimplePageView>
                <div key="createfirst" className={CREATE_FIRSTDB_CSS}>{CREATE_FIRSTDB}</div>
                <CreateDatabase key="createpage" />
            </SimplePageView>
        )
    }
    else if(!canCreate){
        return (
            <SimplePageView >
                <div key="title" className={DBLIST_HEADER_CSS}>{DBLIST_TITLE}</div>
                <DBList key="dbl" dataProvider={dbs}/>
            </SimplePageView>
        )
    }

    let sections = [{id: SERVER_ROUTE, label: DBLIST_TITLE}, {id: CREATE_DB_ROUTE, label: CREATEDB_TITLE}]
    let active = props.page
    return (
        <TabbedPageView active={active} sections={sections}>
            <DBList key="dbl" list={dbs}/>
            <div key="create" className = "container-fluid">
                <hr className = "my-space-15"/>
                <hr className = "my-space-15"/>
                <CreateDatabase />
            </div>
        </TabbedPageView>
    )
}

export default ServerHome;
