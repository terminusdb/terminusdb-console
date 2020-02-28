import React, { useState } from 'react';
import { useAuth0 } from "../../react-auth0-spa";
import { FormInputs } from "../../components/Form/FormInputs"
import { Card, Row, Col, Button, Form, FormGroup, Label,
		 Input, FormText} from "reactstrap";
import { READ, WRITE, MANAGE_ACTION } from "../../variables/databaseHomeLabels"
import RenderTable from "../../components/RenderTable";
import { fakeUserData } from "../../temp/fakeUserData"
import DataTable from 'react-data-table-component';
import { USER_DATABASE_ACCESS, USERS_LIST, MANAGE_USERS } from '../../variables/databaseCategories'
import CategoryHeading from "../../components/CategoryHeadings"
import { InviteModal } from "../../components/Modals/Invite"

const AccessDatabase = () => {
	const [modal, setModal] = useState(false);
	const toggle = () => setModal(!modal);

    /*some mechanism to check if db is shared with other users based on that set users */
    const users = true;
    const userNumber = 2;

     const fields = (opts) => {
         return (
             <FormGroup check className="mb-3 mt-3">
               <Label check>
                 <Input type="radio" name={opts.name} />{' '}
                     {opts.label}
                 <FormText color="muted">
                     {opts.description}
                 </FormText>
               </Label>
             </FormGroup>
         )
     }

     return (
         <Card>
             <div>
                 <CategoryHeading category = {USER_DATABASE_ACCESS}/>
                 <Col md={12}>
     	        	<FormGroup tag="fieldset">
     			        {fields(READ)}
                        {fields(WRITE)}
     		        </FormGroup>
                    <hr/>
     			</Col>
                {users && <div>
                    <CategoryHeading category = {USERS_LIST}/>
                    <Col md={12}>
                    <FormText color="muted">
                        Number of users with access - {userNumber}
                    </FormText>
                    <DataTable  columns={fakeUserData.columnConf}
                                data={fakeUserData.columnData}
                                pagination
                                dense/>
                       <hr/>
                   </Col>
               </div>}
               <CategoryHeading category = {MANAGE_USERS}/>
               <Col md={12}>
                   <hr class='my-space'/>
                   <FormText color="muted">
                       {MANAGE_ACTION.description}
                   </FormText>
                   <hr class='my-space'/>
                   <Row>
                       <Col md={2}>
                           <Button color="primary" onClick={toggle}
                                   style={{ marginBottom: '1rem' }}>Invite</Button>
						   <InviteModal isOpen={modal} toggle={toggle}/>
                       </Col>
                       <Col md={2}>
                           <Button color="primary" onClick={console.log('do something on pull')}
                                   style={{ marginBottom: '1rem' }}>Roles</Button>
                       </Col>
                   </Row>
               </Col>

             </div>
         </Card>
     )
}

export default AccessDatabase;
