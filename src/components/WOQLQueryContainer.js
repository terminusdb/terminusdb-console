import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { WOQLClientObj } from "../init/woql-client-instance";
import TerminusClient from '@terminusdb/terminus-client';


const WOQLQueryContainer = (props) => {

	const query=props.query || TerminusClient.WOQL.query();
	const upQuery=props.runQueryAtLoad || false
	const [woql, setWoql] = useState(query);
    const {woqlClient} = WOQLClientObj();
    const [report, setReport] = useState();
    const [commitMsg, setCommitMsg] = useState("bla bla");
    const [bindings, setBindings] = useState();
    const [toBeUpdate, updateResultQuery] = useState(upQuery);
   // const [reloadQuery ,setQueryChange] = useState();

    //if(props.runStartQuery===true)executeQuery();

	const WOQL=props.query || TerminusClient.WOQL;
	

	const elements = React.Children.toArray(props.children) ;	
    const childrenEl = elements.map((child)=>{
    	return React.cloneElement(child, { updateResultQuery:updateResultQuery,
    							           //setQueryChange:setQueryChange,
    							           setCommitMsg:setCommitMsg,
    							           setWoql:setWoql,

    									   report:report,
    									   woql:woql, //I not secure if I have pass the query down
    									   bindings:bindings})
    })


    function executeQuery(){

    	woql.execute(woqlClient, commitMsg)
        .then((response) => {
            processSuccessfulResult(response)//, start, Date.now())
        })
        .catch((error) => {
            //processErrorResult(error, start, Date.now())
        })
    }


    function processSuccessfulResult(response){
        if(response && response.bindings && response.bindings.length){
            setBindings(response.bindings)
            //rep.rows = res.bindings.length
            //rep.columns = res.binding[0].length
        }
        console.log(response)
        setReport({})
    }

    function processErrorResult(e, start, end){
    }

    useEffect(() => {
       if(toBeUpdate!==false) executeQuery()
    }, [toBeUpdate]);
     

	return(
		  <React.Fragment>
    		{childrenEl}
 		  </React.Fragment>
	)
}
 

export default WOQLQueryContainer;