import React, { useState } from "react";
import { CLASSES_TAB, OWL_TAB, PROPERTIES_TAB, GRAPHS_TAB, PREFIXES_TAB } from "./constants.pages"
import { SCHEMA_CLASSES_ROUTE, SCHEMA_PROPERTIES_ROUTE, SCHEMA_GRAPHS_ROUTE, SCHEMA_OWL_ROUTE, SCHEMA_PREFIXES_ROUTE } from "../../constants/routes"

import { Classes } from '../Schema/Classes'
import { Properties } from '../Schema/Properties'
import { OWL } from '../Schema/OWL'
import { GraphMaker } from '../Schema/GraphManager'
import { PrefixManager } from '../Schema/PrefixManager'
import { TabbedPageView } from '../Templates/TabbedPageView'


const TerminusSchemaPage = (props) => {
    const graphs = {schema: ["main"], instance: ["main"], inference: ["main"]}
    const [graphFilter, setGraphFilter] = useState({type: "schema", gid: "main"})

    const loading = false
    function graphFilterChanged(newFilter){
        setGraphFilter(newFilter)
    }

    function schemaUpdated(data){
        console.log("Terminus Schema Updated", data)
    }

    function getTabsForView(tabs, sections){
        if(graphFilter.type == "schema"){
            tabs.push(<Classes graph={graphFilter} onChangeGraph={graphFilterChanged}/>)
            sections.push({id: SCHEMA_CLASSES_ROUTE, label: CLASSES_TAB})
            tabs.push(<Properties graph={graphFilter} onChangeGraph={graphFilterChanged} />)
            sections.push({id: SCHEMA_PROPERTIES_ROUTE, label: PROPERTIES_TAB})
        }
        tabs.push(<OWL graph={graphFilter} onUpdate={schemaUpdated} onChangeGraph={graphFilterChanged} />)
        sections.push({id: SCHEMA_OWL_ROUTE, label: OWL_TAB})

        tabs.push(<GraphMaker graphs={graphs} />)
        sections.push({id: SCHEMA_GRAPHS_ROUTE, label: GRAPHS_TAB})

        tabs.push(<PrefixManager />)
        sections.push({id: SCHEMA_PREFIXES_ROUTE, label: PREFIXES_TAB})
        return [tabs, sections]
    }

    let [tabs, sections] = getTabsForView([], [])
    return (
        <TabbedPageView loading={loading} report={props.report} sections={sections} active={props.page}>
            {tabs}
        </TabbedPageView>
    )
}


export default TerminusSchemaPage;
