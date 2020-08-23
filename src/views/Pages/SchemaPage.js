import React, {useState, useEffect} from 'react'
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

import {WOQLClientObj} from '../../init/woql-client-instance'
import TerminusClient from '@terminusdb/terminusdb-client'
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

const SchemaPage = (props) => {
    const {graphs, setHead, branch, report} = DBContextObj()

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
        let x = getDefaultSchemaFilter()
        if(x) return x
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
        if (graphs && getDefaultSchemaFilter()) {
            let scgraph = (graphFilter && graphFilter.type != "instance" ? graphFilter : getDefaultSchemaFilter())
            tabs.push(<Classes key="cl" graph={scgraph} onChangeGraph={graphFilterChanged} />)
            sections.push({id: SCHEMA_CLASSES_ROUTE, label: CLASSES_TAB})
            tabs.push(
                <Properties key="pr" graph={scgraph} onChangeGraph={graphFilterChanged} />,
            )
            sections.push({id: SCHEMA_PROPERTIES_ROUTE, label: PROPERTIES_TAB})
        }
        if (graphs) {
            let igraph = (graphFilter ? graphFilter : getDefaultInstanceFilter())
            tabs.push(<GraphManager key="gr" onUpdate={structureUpdated} />)
            sections.push({id: SCHEMA_GRAPHS_ROUTE, label: GRAPHS_TAB})
            tabs.push(
                <OWL
                    key="ow"
                    graph={igraph}
                    onChangeGraph={graphFilterChanged}
                    onUpdate={schemaUpdated}
                />,
            )
            sections.push({id: SCHEMA_OWL_ROUTE, label: OWL_TAB})
            tabs.push(<PrefixManager key="pr" onUpdate={prefixesUpdated} />)
            sections.push({id: SCHEMA_PREFIXES_ROUTE, label: PREFIXES_TAB})
        }
        return [tabs, sections]
    }

    let [tabs, sections] = getTabsForView()

    if (!graphs) {
        if (report) {
            return <TerminusDBSpeaks failure={GRAPHS_LOAD_ERROR} report={report} />
        }
        return <Loading type={TERMINUS_PAGE} />
    }
    return (
        <TabbedPageView dbPage={true} onHeadChange={headChanged} sections={sections} active={props.page}>
            {tabs}
        </TabbedPageView>
    )
}

export default SchemaPage
