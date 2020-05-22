import React, { useState, useEffect } from "react";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CLASSES_TAB, OWL_TAB, PROPERTIES_TAB, GRAPHS_TAB, PREFIXES_TAB } from "./constants"
import { Classes } from './Classes'
import { Properties } from './Properties'
import { OWL } from './OWL'
import { GraphMaker } from './GraphMaker'
import { PrefixManager } from './PrefixManager'
import GraphFilter  from './GraphFilter'
import { PageView } from '../PageView'


const TerminusSchemaPage = () => {
    const graphs = {schema: ["main"], instance: ["main"], inference: ["main"]}
    const [graphFilter, setGraphFilter] = useState({type: "schema", gid: "main"})

    function graphFilterChanged(newFilter){
        setGraphFilter(newFilter)
    }

    function getTabsForView(){
        let tabs = []
        if(graphFilter.type == "schema"){
            tabs.push(
                <Tab eventKey="classes" label = {CLASSES_TAB}>
                    <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                    <Classes graph={graphFilter} rebuild={rebuild}/>
                </Tab>
            )
            tabs.push(
                <Tab eventKey="properties"  label = {PROPERTIES_TAB}>
                    <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                    <Properties graph={graphFilter} rebuild={rebuild}/>
                </Tab>
            )
        }
        tabs.push(
            <Tab eventKey="owl" label = {OWL_TAB}>
                <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                <OWL graph={graphFilter} rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
        )
        tabs.push(
            <Tab eventKey="graphs" label = {GRAPHS_TAB}>
                <GraphMaker graphs={graphs} rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
        )
        tabs.push(
            <Tab eventKey="prefixes" label = {PREFIXES_TAB}>
                <PrefixManager rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
        )
        return tabs
  }

  return (
    <PageView>
        <Tabs>
            {getTabsForView()}
        </Tabs>
    </PageView>
    )
}


export default TerminusSchemaPage;
