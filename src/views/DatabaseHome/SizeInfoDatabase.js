import React from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { FormInputs } from "../../components/Form/FormInputs"
import { Container, Card,Row, Col, Jumbotron,
		 Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import { AUTHOR, CREATED, TRIPLE, COMMIT_MESSAGE,
         MODIFIED_BY, LAST_COMMIT } from "../../variables/databaseHomeLabels"
import { DATABASE_SIZE, DATABASE_CREATED, DATABASE_LAST_CHANGES } from '../../variables/databaseCategories'
import CategoryHeading from "../../components/CategoryHeadings"

const options = (label, val) => {
    return (
        <FormGroup check className="mb-3 mt-3">
          <Label>
            {label}
            <FormText>{val}</FormText>
          </Label>
        </FormGroup>
    )
}

/*** junk info ***/

const SizeInfoDatabase = (props) => {
    return (
        <Card>
            <div>
				<CategoryHeading category = {DATABASE_SIZE}/>
                <Col md={12}>
                    <FormGroup tag="fieldset">
                        {options(TRIPLE, '129 GB')}
                    </FormGroup>
                    <hr/>
                </Col>
				<CategoryHeading category = {DATABASE_CREATED}/>
                <Col md={12}>
                    <FormGroup tag="fieldset">
                        {options(AUTHOR, 'Kitty Jose')}
                        {options(CREATED, '22/05/1980 19:00')}
                    </FormGroup>
                    <hr/>
                </Col>
				<CategoryHeading category = {DATABASE_LAST_CHANGES}/>
                <Col md={12}>
                    <FormGroup tag="fieldset">
                        {options(MODIFIED_BY, 'Kitty Jose')}
                        {options(LAST_COMMIT, '22/05/1980 19:00')}
                        {options(COMMIT_MESSAGE, 'Adding something')}
                    </FormGroup>
                    <hr/>
                </Col>
            </div>
        </Card>
    )
}

export default SizeInfoDatabase;
