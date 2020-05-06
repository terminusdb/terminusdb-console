import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Button, Label }  from "reactstrap";
import Loading from "../components/Loading";
import { serverHomeLabels } from '../variables/content';
import NavBar from '../components/NavBar';
import RenderTable from "../components/RenderTable";
import { SERVER_HOME_PAGE } from "../variables/pageLabels"
import { WOQLClientObj } from "../init/woql-client-instance";
import { getDBListData, getDBListColumns } from '../utils/dataFormatter';
import { isObject } from '../utils/helperFunctions'

const ServerHome = (props) => {
	const {woqlClient} = WOQLClientObj();
	const [dataResponse, setDataResponse] = useState({});

	useEffect(() => {
  	  if(isObject(woqlClient)){
  		  const records = woqlClient.connection.getServerDBMetadata();
		  const columnConf = getDBListColumns(records);
		  const columnData = getDBListData(records);
		  setDataResponse({columnData:columnData, columnConf:columnConf})
  	  }
    }, [woqlClient]);

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
export default ServerHome;
