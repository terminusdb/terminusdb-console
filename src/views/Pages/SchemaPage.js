import React, { useState, useEffect } from "react";
import { CLASSES_TAB, OWL_TAB, PROPERTIES_TAB, GRAPHS_TAB, PREFIXES_TAB, GRAPHS_LOAD_ERROR } from "./constants.pages"
import { TabbedPageView } from '../Templates/PageView'

import { WOQLClientObj } from "../../init/woql-client-instance";
import TerminusClient from '@terminusdb/terminusdb-client';

import { Classes } from '../Schema/Classes'
import { Properties } from '../Schema/Properties'
import { OWL } from '../Schema/OWL'
import { GraphMaker } from '../Schema/GraphManager'
import { PrefixManager } from '../Schema/PrefixManager'
import GraphFilter  from '../Schema/GraphFilter'

const SchemaPage = (props) => {

    const [graphs, setGraphs] = useState();
    const [graphFilter, setGraphFilter] = useState();
    const [rebuild, setRebuild] = useState(0);
    const [hasSchema, setHasSchema] = useState(false);
    const [graphsUpdated, setGraphsUpdated] = useState(false);
    const [hasInference, setHasInference] = useState(false);

    const [pageError, setPageError] = useState(false)
    const [loading, setLoading] = useState(false);
    const {woqlClient} = WOQLClientObj();

    function headChanged(){
        setRebuild(rebuild+1)
    }

    function structureUpdated(){
        setGraphsUpdated(true)
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

    function getTabsForView(hasSchema, hasInference){
        let tabs = []
        let sections = []
        if(hasSchema && graphFilter.type == "schema"){
            tabs.push(<Classes graph={graphFilter} rebuild={rebuild} onChangeGraph={graphFilterChanged} />)
            sections.push({id: SCHEMA_CLASSES_ROUTE, label: CLASSES_TAB})
            tabs.push(<Properties graph={graphFilter} rebuild={rebuild} onChangeGraph={graphFilterChanged} />)
            sections.push({id: SCHEMA_PROPERTIES_ROUTE, label: PROPERTIES_TAB})
        }
        if(hasSchema || hasInference){
            tabs.push(<OWL graph={graphFilter} rebuild={rebuild} onChangeGraph={graphFilterChanged} onUpdate={schemaUpdated}/>)
            sections.push({id: SCHEMA_OWL_ROUTE, label: OWL_TAB})
        }
        tabs.push(<GraphMaker graphs={graphs} rebuild={rebuild} onUpdate={structureUpdated} />)
        sections.push({id: SCHEMA_GRAPHS_ROUTE, label: GRAPHS_TAB})

        tabs.push(<PrefixManager rebuild={rebuild} onUpdate={prefixesUpdated} />)
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
