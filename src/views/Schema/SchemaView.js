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
import { DialogueBox } from "../../components/DialogueBox"

const Schema = (props) => {
  const [graphs, setGraphs] = useState();
  const [graphFilter, setGraphFilter] = useState(props.graphFilter);
  const [rebuild, setRebuild] = useState(0);
  const [hasSchema, setHasSchema] = useState(2);
  const { loading, setLoading } = useState(false);
  const {woqlClient} = WOQLClientObj();
  //retrieves details of the available graphs on mount
  useEffect(() => {
      if(woqlClient.db() == "terminus"){
          setGraphs({schema: ["main"], instance: ["main"], inference: ["main"]})
          setGraphFilter({type: "schema", gid: "main"})
          setHasSchema(true)
          return
      }
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
				}
				if(res['InferenceName']["@value"] && ginf.indexOf(res['InferenceName']["@value"]) == -1){
					ginf.push(res['InferenceName']["@value"])
				}
		  }
		  setGraphs({schema: gschema, instance: ginstances, inference: ginf})
		  if(!graphFilter){
			  if(gschema.length || ginf.length) setHasSchema(true)
              else setHasSchema(false)
			  if(gschema.length > 1) setGraphFilter({type: "schema", gid: "*"})
			  else if(gschema.length) setGraphFilter({type: "schema", gid: gschema[0]})
			  else if(ginf.length > 1) setGraphFilter({type: "inference", gid: "*"})
			  else if(ginf.length) setGraphFilter({type: "inference", gid: ginf[0]})
		  }
	  })
  }, []);

  function headChanged(){
	  setRebuild(rebuild+1)
  }

  function graphUpdated(){
	setRebuild(rebuild+1)
  }

  function graphFilterChanged(newFilter){
    setGraphFilter(newFilter)
  }


/*
* change the result after something is change in woqlclient like branch/commit
*/


  /*if (loading) return <Loading />;  */

  let gs = (graphs && graphs.schema && graphs.schema[0] ? graphs.schema[0] : "none")
  let is = (graphs && graphs.instance && graphs.instance[0] ? graphs.instance[0] : "none")

  return (
    <PageView page="schema">
        {hasSchema && <Tabs>
            <Tab label = {CLASSES_TAB}>
                <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                <hr className = "my-space-15"/>
                <Classes graph={graphFilter} rebuild={rebuild}/>
            </Tab>
            <Tab label = {PROPERTIES_TAB}>
                <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                <hr className = "my-space-15"/>
                <Properties graph={graphFilter} rebuild={rebuild}/>
            </Tab>
            <Tab label = {OWL_TAB}>
                <GraphFilter filter={graphFilter} graphs={graphs} onChange={graphFilterChanged} />
                <OWL graph={graphFilter} rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
            <Tab label = {GRAPHS_TAB}>
                <GraphMaker graphs={graphs} graph={graphFilter} rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
            <Tab label = {PREFIXES_TAB}>
                <PrefixManager rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
        </Tabs>}
        {!hasSchema && <Tabs>
            <Tab label = {GRAPHS_TAB}>
                <GraphMaker graphs={graphs} graph={graphFilter} rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
            <Tab label = {PREFIXES_TAB}>
                <PrefixManager rebuild={rebuild} onUpdate={graphUpdated}/>
            </Tab>
        </Tabs>}
        {!hasSchema && <>
            <hr className = "my-space-15"/>
            <DialogueBox message = { 'No schema available to show, You can add a new Schema.' }/></>}

    </PageView>
    )
}


export default Schema;
