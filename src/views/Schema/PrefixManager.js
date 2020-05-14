import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from "reactstrap"
import RenderTable from "../../components/Table/RenderTable"
import TerminusClient from "@terminusdb/terminusdb-client"
import { WOQLClientObj } from "../../init/woql-client-instance";

export const PrefixManager = (props) => {
    const cols = [
        {name: "Prefix", selector: "prefix"},    
        {name: "URL", selector: "url"}
    ]   

    const builtins = ["rdf", "owl", "vio", "rdfs", "terminus", "xdd", "xsd", "ref", "repo", "layer", "woql"]
       
    let builtin_rows = []
    let extended_rows = []
    const {woqlClient} = WOQLClientObj();
    let ctxt = woqlClient.connection.getJSONContext()
    for(var pr in ctxt){
        if(builtins.indexOf(pr) == -1)
            extended_rows.push({prefix: pr, url: ctxt[pr]})
        else 
            builtin_rows.push({prefix: pr, url: ctxt[pr]})
    }
    let BuiltIn = {columnData:builtin_rows, columnConf:cols};
    let Extended = {columnData:extended_rows, columnConf:cols};
        
    return (
        <Container>
            <h4>User Defined Prefixes</h4> 
            <RenderTable dataProvider = {Extended}/>
            <h4>Built in Prefixes</h4> 
            <RenderTable dataProvider = {BuiltIn}/>            
        </Container>
    )
}




