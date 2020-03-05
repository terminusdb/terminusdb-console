import React, { useState } from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse } from "reactstrap";
import { useAuth0 } from "../react-auth0-spa";
import Loading from "../components/Loading";
import { schemaLabels } from '../variables/content';
import NavBar from '../components/NavBar';
import { SCHEMA_TABS } from "../labels/tabLabels"
import Tab from "../components/Tab"

const Schema = (props) => {
  const { loading, user } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  i//f (loading || !user) {
  //  return <Loading />;
  //}
  const tabs = SCHEMA_TABS || [];

  return (
  	<Container fluid className="h-100 pl-0 pr-0">
        <NavBar/>
  	    <Container className="flex-grow-1">
  	        <Col>
  	  	        <p>{schemaLabels.mainDescription}</p>
  	  	        <hr className="my-2" />
				<Tab for = {SCHEMA_TABS}
					 tabs = {SCHEMA_TABS}
					 defaultState = {SCHEMA_TABS[0].CLASSES_TAB.state}/>
		    </Col>
  		</Container>
  	</Container>
  )

}


export default Schema;
