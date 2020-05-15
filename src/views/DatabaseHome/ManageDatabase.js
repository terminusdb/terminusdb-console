import React, { useState } from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, CardTitle, CardText,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { getCurrentDBID, getCurrentDBName } from "../../utils/helperFunctions"
import { pull, push, fork } from "../../variables/formLabels"
import DeleteDatabase from "../../components/Modals/DeleteDatabase"
import { CommitViewerText } from "../../variables/formLabels"
import { HistoryNavigator } from "../../components/HistoryNavigator/HistoryNavigator"
import {BranchSelector} from "../../components/HistoryNavigator/BranchSelector"
import mascotImg from "../../img/mascot/Mascot-Color.png"
import cmsImg1 from "../../img/icons/comingSoon.png"
import { WOQLClientObj } from "../../init/woql-client-instance";

const ManageDatabase = (props) => {
    const { register, handleSubmit, errors } = useForm();
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
			 {/***** pull*****/}
			 <Col md={12} className="mb-12">
				 <Label><b>Pull Branch</b></Label>
				 <img src={cmsImg1} className="cms-i"/>
				 <img src={mascotImg} className="cms-i"/>
				 <Button outline className="man-btn" color="secondary" type={ pull.action.type }>
				 	  { pull.action.text }
			     </Button>
			 </Col>

			 {/***** push *****/}
			 {divider}
			 <Col md={12} className="mb-12">
				 <Label><b>Push Branch</b></Label>
				 <img src={cmsImg1} className="cms-i"/>
				 <img src={mascotImg} className="cms-i"/>
				 <Button outline className="man-btn" color="secondary" type={ push.action.type }>
				 	  { push.action.text }
			     </Button>
		     </Col>

			 {/***** fork *****/}
			 {divider}
			 <Col md={12} className="mb-12">
				 <Label><b>Fork</b></Label>
				 <img src={cmsImg1} className="cms-i"/>
				 <img src={mascotImg} className="cms-i"/>
				 <Button outline className="man-btn" color="secondary" type={ fork.action.type }>
				 	  { fork.action.text }
			     </Button>
		     </Col>

			 {/***** branch manager *****/}
			 {divider}
		     <Label><b>Create New Branch</b></Label>
			 <hr className = "my-space-25"/>
			 <HistoryNavigator onHeadChange={headChanged} />
		     {divider}

			 {/***** merge branch *****/}
		     <Label><b>Merge Branches</b></Label>
			 <hr className = "my-space-25"/>
			 <span className="d-fl">
			 	  <Col md={6} className="mb-6">
				  	  <Label><b>Source</b></Label>
				  	  <HistoryNavigator onHeadChange={headChanged}/>
				  </Col>
				  <Col md={6} className="mb-6">
				      <Label><b>Target</b></Label>
				  	  <BranchSelector/>
				  </Col>
			 </span>
			 <img src={cmsImg1} className="cms-i"/>
			 <img src={mascotImg} className="cms-i"/>

			 {/***** Delete database *****/}
			 {divider}
		     <Label><b>Delete this database</b></Label>
		     <hr className = "my-space-25"/>
		     <p> Once you delete this database there is no going back. </p>
		     <hr className = "my-space-25"/>
			 <div className = "b-del">
			      <Button color="danger" onClick={toggle}>Delete</Button>
		     </div>
		     {modal && <DeleteDatabase modal={modal}/>}
			 <hr className = "my-space-100"/>
			 {divider}
			 {divider}
		 </>
    )
}

export default ManageDatabase;
