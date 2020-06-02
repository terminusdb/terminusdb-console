import React, { useState, useEffect } from "react";
import { CLASSES_TAB, OWL_TAB, PROPERTIES_TAB, GRAPHS_TAB, PREFIXES_TAB, GRAPHS_LOAD_ERROR } from "./constants.pages"
import { SCHEMA_CLASSES_ROUTE, SCHEMA_PROPERTIES_ROUTE, SCHEMA_GRAPHS_ROUTE, SCHEMA_OWL_ROUTE, SCHEMA_PREFIXES_ROUTE } from "../../constants/routes"

import { WOQLClientObj } from "../../init/woql-client-instance";
import TerminusClient from '@terminusdb/terminusdb-client';
import { DBContextObj } from "../../components/Query/DBContext"

import { Classes } from '../Schema/Classes'
import { Properties } from '../Schema/Properties'
import { OWL } from '../Schema/OWL'
import { GraphManager } from '../Schema/GraphManager'
import { PrefixManager } from '../Schema/PrefixManager'
import { TabbedPageView } from "../Templates/TabbedPageView"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import Loading  from "../../components/Reports/Loading";
import { TERMINUS_COMPONENT, TERMINUS_PAGE } from "../../constants/identifiers";

const SchemaPage = (props) => {

    
    const {woqlClient} = WOQLClientObj();
    const {graphs, ref, branch, report, loading} = DBContextObj();

    const [graphFilter, setGraphFilter] = useState();
    const [graphsUpdated, setGraphsUpdated] = useState(false);

    useEffect(() => {
        if(graphs){
            if(graphFilter){
                setGraphFilter(updateFilter())
            }
            else {
                setGraphFilter(getDefaultFilter())
            }            
        }
    }, [graphs])


    const [pageError, setPageError] = useState(false)

    //updates filter when / if graphs changes
    function updateFilter(){
        let putative = false
        for(var key in graphs){
            if(graphs[key].id == graphFilter.id && graphs[key].type == graphFilter.type ) return
            if( graphs[key].type == graphFilter.type && graphFilter.id == "*") return
            if( graphs[key].type == graphFilter.type) putative = graphs[key].id  
        }
        if(putative) setGraphFilter({id: putative, type: graphFilter.type})
        else setGraphFilter(getDefaultFilter())
    }


    //sets default graph filter depending on graphs configuration
    function getDefaultFilter(){
        let t = false
        let id = false
        for(var key in graphs){
            if(graphs[key].type == "schema"){
                if(t == "schema"){
                    return {type: "schema", id: "*"}
                }
                else {
                    t = "schema"
                    id = graphs[key].id
                }
            }
            else if(graphs[key].type == "inference"){
                if(t == "inference"){
                    id = "*"
                }
                else {
                    t = "inference"
                    id = graphs[key].id
                }
            }
        }
        if(t && id)  return { type: t, id: id }
        return null
    }


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
        if(graphFilter){
            tabs.push( <Classes key="cl" graph={graphFilter} graphs={Object.values(graphs)} onChangeGraph={graphFilterChanged} /> )
            sections.push({id: SCHEMA_CLASSES_ROUTE, label: CLASSES_TAB})
            tabs.push(<Properties key = "pr" graphs={Object.values(graphs)} graph={graphFilter} onChangeGraph={graphFilterChanged} />)
            sections.push({id: SCHEMA_PROPERTIES_ROUTE, label: PROPERTIES_TAB})
            tabs.push(<OWL graphs={Object.values(graphs)} key="ow" graph={graphFilter} onChangeGraph={graphFilterChanged} onUpdate={schemaUpdated} />)
            sections.push({id: SCHEMA_OWL_ROUTE, label: OWL_TAB})
        }
        if(graphs){
            tabs.push(<GraphManager key="gr" graphs={Object.values(graphs)} onUpdate={structureUpdated} />)
            sections.push({id: SCHEMA_GRAPHS_ROUTE, label: GRAPHS_TAB})
            tabs.push(<PrefixManager key="pr" graphs={Object.values(graphs)} onUpdate={prefixesUpdated} />)
            sections.push({id: SCHEMA_PREFIXES_ROUTE, label: PREFIXES_TAB})
        }
        return [tabs, sections]
    }

    let [tabs, sections] = getTabsForView()
    if(!graphs){
        if(report){
            return (<TerminusDBSpeaks failure={GRAPHS_LOAD_ERROR} report={report} />)
        } 
        return (<Loading type={TERMINUS_PAGE} />)
    }
    return (
        <TabbedPageView onHeadChange={headChanged} sections={sections} active={props.page}>
            {tabs}
        </TabbedPageView>
    )
}


export default SchemaPage;
