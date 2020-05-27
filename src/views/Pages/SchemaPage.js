import React, { useState, useEffect } from "react";
import { CLASSES_TAB, OWL_TAB, PROPERTIES_TAB, GRAPHS_TAB, PREFIXES_TAB, GRAPHS_LOAD_ERROR } from "./constants.pages"
import { SCHEMA_CLASSES_ROUTE, SCHEMA_PROPERTIES_ROUTE, SCHEMA_GRAPHS_ROUTE, SCHEMA_OWL_ROUTE, SCHEMA_PREFIXES_ROUTE } from "../../constants/routes"

import { WOQLClientObj } from "../../init/woql-client-instance";
import TerminusClient from '@terminusdb/terminusdb-client';

import { Classes } from '../Schema/Classes'
import { Properties } from '../Schema/Properties'
import { OWL } from '../Schema/OWL'
import { GraphManager } from '../Schema/GraphManager'
import { PrefixManager } from '../Schema/PrefixManager'
import { TabbedPageView } from "../Templates/TabbedPageView"
import { loadGraphStructure } from "../../components/Query/MetadataLoader"

const SchemaPage = (props) => {

    const [graphStructure, report, loading] = loadGraphStructure()
    const [graphFilter, setGraphFilter] = useState({type: "schema", gid: "main"});
    const [graphsUpdated, setGraphsUpdated] = useState(false);


    const [pageError, setPageError] = useState(false)

    function headChanged(){
        //setRebuild(rebuild+1)
    }

    function structureUpdated(){
        //setGraphsUpdated(true)
    }
    
    function schemaUpdated(){
        //setGraphsUpdated(true)
        console.log("schema updated")
    }

    function prefixesUpdated(){
        //setGraphsUpdated(true)
        console.log("prefixes updated")
    }

    function graphFilterChanged(newFilter){
        setGraphFilter(newFilter)
    }

    function getTabsForView(){
        let tabs = []
        let sections = []
        tabs.push( <Classes key="cl" graph={graphFilter} graphs={graphStructure} onChangeGraph={graphFilterChanged} /> )
        sections.push({id: SCHEMA_CLASSES_ROUTE, label: CLASSES_TAB})
        tabs.push(<Properties key = "pr" graphs={graphStructure} graph={graphFilter} onChangeGraph={graphFilterChanged} />)
        sections.push({id: SCHEMA_PROPERTIES_ROUTE, label: PROPERTIES_TAB})
        tabs.push(<OWL key="ow" graph={graphFilter} onChangeGraph={graphFilterChanged} onUpdate={schemaUpdated}/>)
        sections.push({id: SCHEMA_OWL_ROUTE, label: OWL_TAB})
        tabs.push(<GraphManager key="gr" graphs={graphStructure} onUpdate={structureUpdated} />)
        sections.push({id: SCHEMA_GRAPHS_ROUTE, label: GRAPHS_TAB})
        tabs.push(<PrefixManager key="pr" graphs={graphStructure} onUpdate={prefixesUpdated} />)
        sections.push({id: SCHEMA_PREFIXES_ROUTE, label: PREFIXES_TAB})
        return [tabs, sections]
    }

    let [tabs, sections] = getTabsForView()
    return (
        <TabbedPageView loading={loading} onHeadChange={headChanged} sections={sections} active={props.page}>
            {tabs}
        </TabbedPageView>
    )
}


export default SchemaPage;
