import React, { useState } from "react";
import { Container, Row, Col, Jumbotron, Card, CardText, CardBody, 
		 Button, Form, FormGroup, Label, Input, FormText, Collapse }  from "reactstrap";
import { useAuth0 } from "../react-auth0-spa";
import Loading from "../components/Loading";
import { serverHomeLabels } from '../variables/content';
import NavBar from '../components/NavBar';
import RenderTable from "../components/RenderTable";
import { RENDER_TYPE_TABLE } from "../labels/renderTypeLabels";
import { LIST_OF_DATABASE_QUERY } from "../labels/queryLabels";
import { SERVER_HOME_PAGE } from "../variables/pageLabels"
import { HOME_ICON } from '../labels/iconLabels'
import { QueryHook } from "../hooks/QueryHook";
import { AddIcon } from "../components/LoadFontAwesome";

const ServerHome = (props) => {
  const { loading, user } = useAuth0();
  const [dataResponse] = QueryHook(LIST_OF_DATABASE_QUERY,RENDER_TYPE_TABLE);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  //if (loading || !user) return <Loading />;
  if (loading) return <Loading />;

  return (
  	<Container fluid className = "h-100 pl-0 pr-0">
	    <NavBar resetDB = {true}/>
	  	<Container className = "flex-grow-1">
	  	  <Col>
	  	  	 <hr className = "my-space-50"/>
			 <legend>{ serverHomeLabels.title }</legend>
			 <hr className = "my-3"/>
			 <div className = "container-fluid">
	             <Card>
	                 <CardBody>
						 <RenderTable dataProvider = {dataResponse}
						 			  fromPage = { SERVER_HOME_PAGE.page }/>
					  </CardBody>
 	             </Card>
 	         </div>
	      </Col>
	    </Container>
  	</Container>
  )

}

//<AddIcon icon= {HOME_ICON} size={'3x'} />

export default ServerHome;
