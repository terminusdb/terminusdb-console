import React, {useState, useEffect} from 'react'
//import {getDBPageRoute} from '../Router/ConsoleRouter'
import {
    CLASSES_TAB,
    OWL_TAB,
    PROPERTIES_TAB,
    GRAPHS_TAB,
    PREFIXES_TAB,
    GRAPHS_LOAD_ERROR,
} from './constants.pages'
import {
    SCHEMA_CLASSES_ROUTE,
    SCHEMA_PROPERTIES_ROUTE,
    SCHEMA_GRAPHS_ROUTE,
    SCHEMA_OWL_ROUTE,
    SCHEMA_PREFIXES_ROUTE,
} from '../../constants/routes'

import {DBContextObj} from '../../components/Query/DBContext'
import {Classes} from '../Schema/Classes'
import {Properties} from '../Schema/Properties'
import {OWL} from '../Schema/OWL'
import {GraphManager} from '../Schema/GraphManager'
import {PrefixManager} from '../Schema/PrefixManager'
import {TabbedPageView} from '../Templates/TabbedPageView'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import Loading from '../../components/Reports/Loading'
import {TERMINUS_COMPONENT, TERMINUS_PAGE} from '../../constants/identifiers'
import {formatBytes} from "../Server/DBList"
import {PageView} from "../Templates/PageView"
import {NoPageLayout} from '../../components/Router/PrivateRoute'

const SchemaPage = (props) => {
    const {graphs, setHead, branch, report, prefixes} = DBContextObj()

    const [graphFilter, setGraphFilter] = useState()

    useEffect(() => {
        if (graphs) {
            if (graphFilter) {
                let fi = updateFilter()
                setGraphFilter(fi)
            } else {
                setGraphFilter()
            }
        }
    }, [graphs])

    //updates filter when / if graphs changes
    function updateFilter() {
        let putative = false
        for (var key in graphs) {
            if (graphs[key].id == graphFilter.id && graphs[key].type == graphFilter.type)
                return graphFilter
            if (graphs[key].type == graphFilter.type && graphFilter.id == '*') return graphFilter
            if (graphs[key].type == graphFilter.type) putative = graphs[key].id
        }
        if (putative) return {id: putative, type: graphFilter.type}
        else return getDefaultFilter()
    }

    //sets default graph filter depending on graphs configuration
    function getDefaultSchemaFilter() {
        let t = false
        let id = false
        for (var key in graphs) {
            if (graphs[key].type == 'schema') {
                if (t == 'schema') {
                    return {type: 'schema', id: '*'}
                } else {
                    t = 'schema'
                    id = graphs[key].id
                }
            } else if (graphs[key].type == 'inference') {
                if (t == 'inference') {
                    id = '*'
                } else if (t != 'schema') {
                    t = 'inference'
                    id = graphs[key].id
                }
            }
        }
        if (t && id) return {type: t, id: id}
        return undefined
    }

    function getDefaultInstanceFilter() {
        let cand = false;
        for (var key in graphs) {
            if (graphs[key].type == 'schema'){
                if(!cand || cand.type != 'schema' || graphs[key].id == "main"){
                    cand = graphs[key]
                }
            }            
            if (graphs[key].type == 'inference'){
                if(!cand || cand.type == 'instance'){
                    cand = graphs[key]
                }
            }
            if (graphs[key].type == 'instance'){
                if(!cand){
                    cand = graphs[key]
                }
            }
        }
        if(cand) return cand
        return {type: "instance", id: "main"}
    }

    function headChanged() {
        //setRebuild(rebuild+1)
    }

    function structureUpdated() {
        setHead(branch)
    }

    /**
     * Prompt refresh by setting time to slightly in future
     */
    function schemaUpdated() {
        setHead(branch)
    }

    function prefixesUpdated() {
        console.log('prefixes updated')
    }

    function graphFilterChanged(newFilter) {
        setGraphFilter(newFilter)
    }

    function getTabsForView() {
        let tabs = []
        let sections = []
        if (graphs){       
            switch(props.page){
               case SCHEMA_CLASSES_ROUTE: 
                    if (getDefaultSchemaFilter()) {
                        let scgraph = (graphFilter && graphFilter.type !== "instance" ? graphFilter : getDefaultSchemaFilter())
                        tabs.push(<Classes key="cl" graph={scgraph} onChangeGraph={graphFilterChanged} />)
                    }
                    break;
                case SCHEMA_PROPERTIES_ROUTE:
                    if (getDefaultSchemaFilter()) {
                        let scgraph = (graphFilter && graphFilter.type !== "instance" ? graphFilter : getDefaultSchemaFilter())
                         tabs.push(
                            <Properties key="pr" graph={scgraph} onChangeGraph={graphFilterChanged} />,
                        )
                    }
                    break;
                case SCHEMA_GRAPHS_ROUTE:
                    //let igraph = (graphFilter ? graphFilter : getDefaultInstanceFilter())
                    tabs.push(<GraphManager key="gr" onUpdate={structureUpdated} />)
                    break;
                case SCHEMA_OWL_ROUTE:
                    let igraph = (graphFilter ? graphFilter : getDefaultInstanceFilter())
                    tabs.push(<OWL key="ow" graph={igraph} onChangeGraph={graphFilterChanged} onUpdate={schemaUpdated} />)
                    break;
                case SCHEMA_PREFIXES_ROUTE:
                    tabs.push(<PrefixManager key="pr" onUpdate={prefixesUpdated} />)
            }
        }
        return [tabs]
    }

    let [tabs] = getTabsForView()  

    if (!graphs) {
        if (report) {
            return <TerminusDBSpeaks failure={GRAPHS_LOAD_ERROR} report={report} />
        }
        return <Loading type={TERMINUS_PAGE} />
    }
    if(tabs.length===0){
        return <NoPageLayout noLoginButton={true} text="There is no data for this view." />
    }
    return (
        <PageView dbPage={true} active={props.page}>
            {tabs}
        </PageView>
    )
}

export default SchemaPage
