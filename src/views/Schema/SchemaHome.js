import React, { useState } from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import { schemaLabels } from '../../variables/content';
import NavBar from '../../components/NavBar';
import { SCHEMA_TABS } from "../../labels/tabLabels"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import { CLASSES_TAB, OWL_TAB, PROPERTIES_TAB } from "../../labels/tabLabels"
import { Classes } from './Classes'
import { Properties } from './Properties'
import { OWL } from './OWL'

const Schema = (props) => {
  const { loading, user } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  //if (loading || !user) {
  //  return <Loading />;
  //}

  if (loading) return <Loading />;

  const tabs = SCHEMA_TABS || [];

  return (
  	<Container fluid className="h-100 pl-0 pr-0">
        <NavBar/>
  	    <Container className="flex-grow-1">
  	        <Col>
				<div class="sch-disp">
					<Tabs>
					    <Tab label = {CLASSES_TAB}>
						    <hr className = "my-space-15"/>
							<Classes/>
					    </Tab>
						<Tab label = {PROPERTIES_TAB}>
							<hr className = "my-space-15"/>
							<Properties/>
						</Tab>
						<Tab label = {OWL_TAB}>
							<hr className = "my-space-15"/>
							<OWL/>
						</Tab>
					</Tabs>
				</div>
		    </Col>
  		</Container>
  	</Container>
  )

}


export default Schema;
