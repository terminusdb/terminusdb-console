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
import BranchSelector from "../../components/HistoryNavigator/BranchSelector"
import cmsImg1 from "../../img/placeholders/comingSoon-1.png"

const ManageDatabase = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [userInfo, setCreateUserInfo] =  useState({})
	const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

	const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const onSubmit = (data) => {
		if (!user){
  		  loginWithRedirect();  // authenticate
  	  }
    };

    const onCreateBranch = (data) => {
        dbClient.branch(data.bId, branchInfo.uri_prefix)
        .then(() => {
            changeBranch(bid)
        })
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
				 <Button outline className="man-btn" color="secondary" type={ pull.action.type }>
				 	  { pull.action.text }
			     </Button>
			 </Col>

			 {/***** push *****/}
			 {divider}
			 <Col md={12} className="mb-12">
				 <Label><b>Push Branch</b></Label>
				 <Button outline className="man-btn" color="secondary" type={ push.action.type }>
				 	  { push.action.text }
			     </Button>
		     </Col>

			 {/***** fork *****/}
			 {divider}
			 <Col md={12} className="mb-12">
				 <Label><b>Fork</b></Label>
				 <Button outline className="man-btn" color="secondary" type={ fork.action.type }>
				 	  { fork.action.text }
			     </Button>
		     </Col>

			 {/***** branch manager *****/}
			 {divider}
		     <Label><b>Create New Branch</b></Label>
			 <hr className = "my-space-15"/>
			 <HistoryNavigator />
		     {divider}

			 {/***** merge branch *****/}
		     <Label><b>Merge Branches</b></Label>
			 <hr className = "my-space-15"/>
			 <span className="d-fl">
			 	  <Col md={6} className="mb-6">
				  	  <Label><b>Source</b></Label>
				  	  <HistoryNavigator />
				  </Col>
				  <Col md={6} className="mb-6">
				      <Label><b>Target</b></Label>
				  	  <BranchSelector/>
				  </Col>

			 </span>

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
