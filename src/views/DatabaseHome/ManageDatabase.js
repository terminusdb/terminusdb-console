import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import { CLONE, ORIGIN, PRIVATE, PUBLIC, ACTIONS } from "../../variables/databaseHomeLabels"
import { DATABASE_IS, DATABASE_ACTIONS, DATABASE_ACCESS } from "../../variables/databaseCategories"
import CategoryHeading from "../../components/CategoryHeadings"

const ManageDatabase = (props) => {

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
			    <CategoryHeading category = {DATABASE_IS}/>
                <Col md={12}>
    	        	<FormGroup tag="fieldset">
    			        {fields(CLONE)}
                        {fields(ORIGIN)}
    		        </FormGroup>
                    <hr/>
    			</Col>
				<CategoryHeading category = {DATABASE_ACCESS}/>
                <Col md={12}>
    	        	<FormGroup tag="fieldset">
    			        {fields(PRIVATE)}
                        {fields(PUBLIC)}
    		        </FormGroup>
                    <hr/>
    			</Col>
				<CategoryHeading category = {DATABASE_ACTIONS}/>
                <Col md={12}>
                    <hr class='my-space'/>
                    <FormText color="muted">
                        {ACTIONS.description}
                    </FormText>
                    <hr class='my-space'/>
                    <Row>
                        <Col md={2}>
                            <Button color="primary" onClick={console.log('do something on push')}
                                    style={{ marginBottom: '1rem' }}>Push</Button>
                        </Col>
                        <Col md={2}>
                            <Button color="primary" onClick={console.log('do something on pull')}
                                    style={{ marginBottom: '1rem' }}>Pull</Button>
                        </Col>
                    </Row>
                </Col>
            </div>
        </Card>
    )
}

export default ManageDatabase;
