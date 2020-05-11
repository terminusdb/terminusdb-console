import React, { useState, useEffect } from "react";
//import WOQLQueryContainer from "../components/WOQLQueryContainer";
import * as q from "../labels/queryLabels";

import TerminusClient from '@terminusdb/terminusdb-client';
//import {ResultViewer} from  "../components/QueryPane/ResultViewer"
import {WOQLQueryContainerHook} from "../components/WOQLQueryContainerHook";
import {QueryLibrary} from "../components/QueryPane/QueryLibrary"

import TestResult from "./TestResult";

/*
* this is load ones 
*/
const TestHome = (props) => {
 	const query= TerminusClient.WOQL.star();

    const [setWoql,setCommitMsg,report,bindings] = WOQLQueryContainerHook(query);
  

    const libs=[q.SHOW_ALL_SCHEMA_ELEMENTS,
                q.SHOW_ALL_CLASSES,
                q.SHOW_ALL_PROPERTIES,
                q.SHOW_DOCUMENT_CLASSES]

	return (<div>hello
			<QueryLibrary setWoql={setWoql} libs={libs}/>
			<TestResult bindings={bindings}/>
			</div>
	)
}


export default TestHome;
