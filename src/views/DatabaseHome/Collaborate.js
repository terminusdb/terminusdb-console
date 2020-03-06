import React, {useState}from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		Button, Form, FormGroup, Label, Input, FormText, Collapse} from "reactstrap";
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"
import { CREATE_NEW_USER } from "../../labels/actionLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { collaborate, createUser } from "../../variables/formLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels";
import { AddIcon } from "../../components/LoadFontAwesome"
import { fakeUserData } from "../../temp/fakeUserData"
import { EDIT } from '../../labels/iconLabels'
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CURRENT_USERS, CREATE_USER, ADD_USER, INVITE_USER } from '../../labels/tabLabels'
import { ClientHook } from '../../hooks/ClientHook'
import CreateNewUser from './CreateUser'
import UserList from './UserList'
import AddUsers from './AddUsers'

const Collaborate = (props) => {
    const { register, handleSubmit, errors } = useForm();
	const { isAuthenticated, user } = useAuth0();

	const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    //junk database
    const dbStats = WRITE.label;

    /*some mechanism to check if db is shared with other users based on that set users */
    const users = true;
    const managePermissions = true;

    return (
        <Card>
            <div>
				<hr className="my-space-50"/>
				<hr className="my-space-50"/>
				<hr className="my-space-50"/>

	            	<label className = { collaborate.accessHeader.className }
	                    htmlFor = { collaborate.accessHeader.name }>
	            		{ collaborate.accessHeader.label }
	                </label>

                     <span className="d-fl">
                        <Col md={1} className="mb-1">
                            <input type="checkbox"
                               name={ READ.name }
							   ref = { register }
                               checked={dbStats === READ.name }/>
                       </Col>
                       <Col md={3} className="mb-3">
                           <label htmlFor = { READ.name }/>
                               { READ.label }
                       </Col>

                       <Col md={1} className="mb-1">
                           <input type="checkbox"
                              name={ READ.name }
							  ref = { register }
                              checked={dbStats === WRITE.name }/>
                      </Col>
                      <Col md={3} className="mb-3">
                          <label htmlFor = { WRITE.name }/>
                              { WRITE.label }
                      </Col>

                      <Col md={1} className="mb-1">
                          <input type="checkbox"
                             name={ MANAGE.name }
							 ref = { register }
                             checked={dbStats === MANAGE.name }/>
                     </Col>
                     <Col md={3} className="mb-3">
                         <label htmlFor = { MANAGE.name }/>
                             { MANAGE.label }
                     </Col>
                  </span>

                 <hr className = "my-space-15"/>
                 <hr className = "my-2"/>
                 <hr className = "my-space-50"/>

                  {managePermissions && <>
                     <Tabs>
                         <Tab label = {CURRENT_USERS}>
                             <hr className = "my-space-50"/>
                             <UserList/>
                         </Tab>
     				    <Tab label = {CREATE_USER}>
     					    <hr className = "my-space-50"/>
     						<CreateNewUser/>
     				    </Tab>
     				    <Tab label = {ADD_USER}>
     						<hr className = "my-space-50"/>
     						<AddUsers/>
     					</Tab>
                        <Tab label = {INVITE_USER}>
     						<hr className = "my-space-50"/>
     						INVITE_USER
     					</Tab>
     				</Tabs> </>
                 }

           </div>
       </Card>
    )
}

export default Collaborate;
