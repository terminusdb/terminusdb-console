import React, {useState}from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container,Row, Col, Jumbotron,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"
import { collaborate, createUser } from "../../variables/formLabels"
import { fakeUserData } from "../../temp/fakeUserData"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CURRENT_USERS, CREATE_USER, ADD_USER, INVITE_USER } from '../../labels/tabLabels'
import CreateNewUser from './CreateUser'
import UserList from './UserList'
import AddUsers from './AddUsers'
import { ComingSoon } from "../../components/Reports/ComingSoon"
import {collaborateSoonIntro, collaborateSoonTop, collaborateSoonBottom, collaborateSoonBox, collaborateSoonButton} from "./constants"

const Collaborate = (props) => {
    const { register, handleSubmit, errors } = useForm();
	const { isAuthenticated, user } = useAuth0();

    //junk database
    const dbStats = WRITE.label;

    /*some mechanism to check if db is shared with other users based on that set users */
    const users = true;
    const managePermissions = true;



    return (
        <div>
			<hr className="my-space-50"/>
            <Container>
                <Row>
                    <Col md={4} className={collaborateSoonIntro}>
                        <ComingSoon size="small"/>
                    </Col>
                    <Col md={2} className={collaborateSoonBox}>
                         <Row className={collaborateSoonTop}>Share your database on Terminus DB Hub</Row>
                         <Row className={collaborateSoonBottom}><div className={collaborateSoonButton}>Share</div></Row>
                    </Col>
                    <Col md={2} className={collaborateSoonBox}>
                        <Row className={collaborateSoonTop}>Push updates to your collaborators</Row> 
                        <Row className={collaborateSoonBottom}><div className={collaborateSoonButton}>Push</div></Row>
                    </Col>
                    <Col md={2} className={collaborateSoonBox}>
                        <Row className={collaborateSoonTop}>Pull updates from collaborators</Row>
                        <Row className={collaborateSoonBottom}><div className={collaborateSoonButton}>Pull</div></Row> 
                    </Col>
                    <Col md={2} className={collaborateSoonBox}>
                        <Row className={collaborateSoonTop}>Build data operations pipelines</Row>
                        <Row className={collaborateSoonBottom}><div className={collaborateSoonButton}>Pipeline</div></Row>
                    </Col>
                </Row>
            </Container>
			<hr className="my-space-50"/>
              {managePermissions && <>
                 <Tabs>
                     <Tab label = {CURRENT_USERS}>
                         <hr className = "my-space-50"/>
                         <UserList/>
                     </Tab>
 				    {/*<Tab label = {CREATE_USER}>
 					    <hr className = "my-space-50"/>
 						<CreateNewUser/>
 				    </Tab>*/}
 				    <Tab label = {ADD_USER}>
 						<hr className = "my-space-50"/>
 						<AddUsers/>
 					</Tab>
                    {/*<Tab label = {INVITE_USER}>
 						<hr className = "my-space-50"/>
 						INVITE_USER
 					</Tab>*/}
 				</Tabs> </>
             }

       </div>
    )
}

export default Collaborate;
