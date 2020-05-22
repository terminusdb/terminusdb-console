import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { Col } from "reactstrap"
import { CLASSES_TAB, OWL_TAB, PROPERTIES_TAB, GRAPHS_TAB, PREFIXES_TAB } from "../../labels/tabLabels"
import { Classes } from './Classes'
import { Properties } from './Properties'
import { OWL } from './OWL'
import { GraphMaker } from './GraphMaker'
import { PrefixManager } from './PrefixManager'
import { WOQLClientObj } from "../../init/woql-client-instance";
import TerminusClient from '@terminusdb/terminusdb-client';
import GraphFilter  from './GraphFilter'
import { PageView } from '../PageView'
import {GRAPHS_LOAD_ERROR} from "./constants"
import {PageFailure} from "../../components/Reports/PageFailure"

const SchemaPage = (props) => {
    const [graphs, setGraphs] = useState();
    const [graphFilter, setGraphFilter] = useState(props.graphFilter);
    const [rebuild, setRebuild] = useState(0);
    const [hasSchema, setHasSchema] = useState(false);
    const [graphsUpdated, setGraphsUpdated] = useState(false);
    const [hasInference, setHasInference] = useState(false);

    const [pageError, setPageError] = useState(false)
    const [loading, setLoading] = useState(false);
    const {woqlClient} = WOQLClientObj();
  //retrieves details of the available graphs on mount
    useEffect(() => {
        setLoading(true)
        const q = TerminusClient.WOQL.lib().loadBranchGraphNames(woqlClient)
        woqlClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let ginstances = []
            let ginf = []
            let gschema = []
            var res
            while(res = wr.next()){
                    if(res['InstanceName']["@value"] && ginstances.indexOf(res['InstanceName']["@value"]) == -1){
                        ginstances.push(res['InstanceName']["@value"])
                    }
                    if(res['SchemaName']["@value"] && gschema.indexOf(res['SchemaName']["@value"]) == -1){
                        gschema.push(res['SchemaName']["@value"])
                        setHasSchema(true)
                    }
                    if(res['InferenceName']["@value"] && ginf.indexOf(res['InferenceName']["@value"]) == -1){
                        ginf.push(res['InferenceName']["@value"])
                        setHasInference(true)
                    }
            }
            setGraphs({schema: gschema, instance: ginstances, inference: ginf})
            if(!graphFilter){
                if(gschema.length || ginf.length) setHasSchema(true)
                if(gschema.length > 1) setGraphFilter({type: "schema", gid: "*"})
                else if(gschema.length) setGraphFilter({type: "schema", gid: gschema[0]})
                else if(ginf.length > 1) setGraphFilter({type: "inference", gid: "*"})
                else if(ginf.length) setGraphFilter({type: "inference", gid: ginf[0]})
            }
            let x = getDefaultActiveKey()
            setLoading(false)
        }).catch((e) => {
            setLoading(false)
            setPageError(e)
        })
    }, [graphsUpdated]);

    function headChanged(){
        setRebuild(rebuild+1)
    }

    function graphUpdated(){
        setGraphsUpdated(true)
    }

    function graphFilterChanged(newFilter){
        setGraphFilter(newFilter)
    }

    function getDefaultActiveKey(){
        if(hasSchema && graphFilter.type == "schema") return "classes"
        if(hasInference && graphFilter.type == "inference") return "owl"
        return "graphs"
    }

    function getTabsForView(){
        let tabs = []
        if(hasSchema && graphFilter.type == "schema"){
            tabs.push(
                <Tab key="classes" eventKey="classes" label = {CLASSES_TAB}>
                    <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                    <Classes graph={graphFilter} rebuild={rebuild}/>
                </Tab>
            )
            tabs.push(
                <Tab key="classes" eventKey="properties"  label = {PROPERTIES_TAB}>
                    <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                    <Properties graph={graphFilter} rebuild={rebuild}/>
                </Tab>
            )
        }
        if(hasSchema || hasInference){
            tabs.push(
                <Tab key="classes" eventKey="owl" label = {OWL_TAB}>
                    <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                    <OWL graph={graphFilter} rebuild={rebuild} onUpdate={graphUpdated}/>
                </Tab>
            )
        }
        tabs.push(
            <Tab key="classes" eventKey="graphs" label = {GRAPHS_TAB}>
                <GraphMaker graphs={graphs} rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
        )
        tabs.push(
            <Tab key="classes" eventKey="prefixes" label = {PREFIXES_TAB}>
                <PrefixManager rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
        )
        return tabs
  }

  let gs = (graphs && graphs.schema && graphs.schema[0] ? graphs.schema[0] : "none")
  let is = (graphs && graphs.instance && graphs.instance[0] ? graphs.instance[0] : "none")

  if (pageError) return <PageFailure failure={GRAPHS_LOAD_ERROR} report={pageError} />
  return (
    <PageView page="schema" onHeadChange={headChanged}>
        {!loading && 
            <Tabs>
                {getTabsForView()}
            </Tabs>
        }
        {loading &&
            <Loading /> 
        }
    </PageView>
    )
}


export default SchemaPage;
