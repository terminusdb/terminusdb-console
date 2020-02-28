import React from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText} from "reactstrap";
import { useAuth0} from "../react-auth0-spa";
import Loading from "../components/Loading";
import {createTeamLabels} from '../variables/content'

const CreateTeam = (props) => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }

  return (
  	<Container className="flex-grow-1">
  	  <Col className="new-box">
  	  	<h4>{createTeamLabels.title}</h4>
  	  	<p>{createTeamLabels.mainDescription}</p>
  	  	<hr className="my-2" />
  	  	  <Form>
      		<Row form className="mb-2">
		        <Col md={12}>
		          <FormGroup>
		            <Label for="title">Team account name *</Label>
		            <Input type="text" name="title" id="title" placeholder="The name of ..." />
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
	         <Row form className="lead text-right mt-4">
            	<Button color="primary" onClick={()=> {props.history.replace('/newDB')}}>Create New Team</Button>
          	</Row>
		    </Form>
		</Col>
  	</Container>
  )

}


export default CreateTeam;
