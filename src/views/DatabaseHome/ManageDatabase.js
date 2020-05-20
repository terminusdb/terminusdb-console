import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { Container, Card,Row, Col, CardTitle, CardText,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { pull, push, fork } from "../../variables/formLabels"
import DeleteDatabase from "../../components/Modals/DeleteDatabase"
import { HistoryNavigator } from "../../components/HistoryNavigator/HistoryNavigator"
import {BranchSelector} from "../../components/HistoryNavigator/BranchSelector"
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TCSubmitWrap } from "../../components/Form/FormComponents"
import { CreateBranch } from "./ManageActions/Branch"
import { MergeBranch } from "./ManageActions/Merge"
import { ForkBranch } from "./ManageActions/Fork"
import { ManageGraphs } from "./ManageActions/Graphs"
import { ManagePrefixes } from "./ManageActions/Prefixes"

import { 
    TERMINUS_FORK_TITLE, TERMINUS_MERGE_BLURB, TERMINUS_MERGE_TITLE, TERMINUS_FORK_BLURB, 
    TERMINUS_BRANCH_TITLE, TERMINUS_BRANCH_BLURB, TERMINUS_PREFIXES_TITLE, TERMINUS_GRAPHS_TITLE, 
    TERMINUS_DELETE_TITLE, TERMINUS_DELETE_BLURB, TERMINUS_PREFIXES_BLURB, TERMINUS_GRAPHS_BLURB,
    DELETE_BUTTON 
 } from "./constants"

const mascotImg = "https://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png";
const cmsImg1 = "https://assets.terminusdb.com/terminusdb-console/images/comingSoon.png";

const ManageDatabase = (props) => {
    const [userInfo, setCreateUserInfo] =  useState({})
	const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const {woqlClient} = WOQLClientObj();

	const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const onSubmit = (data) => {
		if (!user){
  		  loginWithRedirect();  // authenticate
  	  }
    };

    function headChanged(b, r){
    }


	const divider = <>
		<hr className = "my-space-50"/>
		<hr className = "my-space-2"/>
		<hr className = "my-space-50"/>
	</>


    return (
             <>
			 <hr className = "my-space-100"/>

			 <Col md={12} className="mb-12">
                <strong>{TERMINUS_BRANCH_TITLE}</strong>
			 	<p>{TERMINUS_BRANCH_BLURB}</p>
			 	<CreateBranch />
			 </Col>

			 {divider}
			 <Col md={12} className="mb-12">
			 	<strong>{TERMINUS_MERGE_TITLE}</strong>
			 	<p>{TERMINUS_MERGE_BLURB}</p>
			 	<MergeBranch />
			 </Col>

			 {divider}
			 <Col md={12} className="mb-12">
                <strong>{TERMINUS_FORK_TITLE}</strong>
                <p>{TERMINUS_FORK_BLURB}<ForkBranch /></p>
			 </Col>

			 {divider}
			 <Col md={12} className="mb-12">
			 	<strong>{TERMINUS_GRAPHS_TITLE}</strong>
			 	<p>{TERMINUS_GRAPHS_BLURB}</p>
			 	<ManageGraphs />
			 </Col>

			 {divider}
			 <Col md={12} className="mb-12">
			 	<strong>{TERMINUS_PREFIXES_TITLE}</strong>
			 	<p>{TERMINUS_PREFIXES_BLURB}</p>
			 	<ManagePrefixes />
			 </Col>

             {divider}
			 <Col md={12} className="mb-12">
			 	<strong>{TERMINUS_DELETE_TITLE}</strong>
			 	<p>{TERMINUS_DELETE_BLURB}</p>
                <TCSubmitWrap>
                    <Button color="danger" onClick={toggle}>{DELETE_BUTTON}</Button>
                </TCSubmitWrap>            
		    	 {modal && <DeleteDatabase modal={modal}/>}
			 </Col>
		 </>
    )
}

export default ManageDatabase;
