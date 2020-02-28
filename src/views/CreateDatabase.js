import React, {useState} from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import { useAuth0} from "../react-auth0-spa";
import Loading from "../components/Loading";
import {createDatabaseLabels} from '../variables/content'
import NavBar from '../components/NavBar'

const CreateDatabase = (props) => {
  const { loading, user } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  /*if (loading || !user) {
    return <Loading />;
  }*/
  return (
  	<Container fluid className="h-100 pl-0 pr-0">
    <NavBar resetDB = {true}/>
  	<Container className="flex-grow-1">
  	  <Col className="new-box">
  	  	<h4>{createDatabaseLabels.title}</h4>
  	  	<p>{createDatabaseLabels.mainDescription}</p>
  	  	<hr className="my-2" />
  	  	<Form>
  	  		<Row form className="mt-4">
		        <Col md={4}>
		          <FormGroup>
		            <Label for="exampleCity">Team</Label>
		             <Input type="select" name="team" id="team">
			          <option>Owner</option>
			          <option>Team1</option>
			        </Input>
		          </FormGroup>
		        </Col>
		        <Col md={8}>
		          <FormGroup>
		            <Label for="exampleState">Database Id *</Label>
		            <Input type="text" name="dbname" id="dbname"/>
		            <FormText>No spaces or special characters allowed in IDs</FormText>
		          </FormGroup>
		        </Col>
      		</Row>
      		<Row form className="mb-2">
		        <Col md={12}>
		          <FormGroup>
		            <Label for="title">Title *</Label>
		            <Input type="text" name="title" id="title" placeholder="A brief title for the Database" />
		          </FormGroup>
		        </Col>
	        </Row>
	      	<Row form className="mb-4">
		        <Col md={12}>
		          <FormGroup>
		            <Label for="exampleEmail">Description</Label>
		            <Input type="text" name="description" id="description" placeholder="A short text describing the database and its purpose" />
		          </FormGroup>
		        </Col>
	        </Row>
	        <hr className="my-2" />
	        <Row form>
	        <Col md={12}>
	        	<FormGroup tag="fieldset">
			        <FormGroup check className="mb-3 mt-3">
			          <Label check>
			            <Input type="radio" name="public" />{' '}
			            	Public Database
			            <FormText color="muted">
				          Anyone can see this TerminusDB database. You choose who can commit.
				        </FormText>
			          </Label>
			        </FormGroup>
			        <FormGroup check>
			          <Label check>
			            <Input type="radio" name="private" />{' '}
			            	Private Database
			            <FormText color="muted">
				         	You choose who can see and commit to this TerminusDB database.
				        </FormText>
			          </Label>
			        </FormGroup>
		      	  </FormGroup>
			    </Col>
			    </Row>
			    <Row form>
			    	<Col md={12}>
				    	<Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>Extra Settings</Button>
				    	<hr className="my-2" />
					      <Collapse isOpen={isOpen}>
				          	<FormGroup>
					            <Label for="exampleState">Categorization</Label>
					            <Input type="text" name="dbname" id="dbname"/>
					            <FormText>Blallllll</FormText>
					        </FormGroup>
					 	</Collapse>
					</Col>
			    </Row>
			    <Row form className="lead text-right mt-4">
            		<Button color="primary" onClick={()=> {props.history.replace('/newDB')}}>
            			+ Create New Database
            		</Button>
          		</Row>
		        </Form>
		  	  </Col>
  		</Container>
  	</Container>
  )

}


export default CreateDatabase;
