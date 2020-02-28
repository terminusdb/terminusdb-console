import React, {useState} from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import {databaseHomeLabels} from '../../variables/content';
import NavBar from '../../components/NavBar';
import RenderTable from "../../components/RenderTable";
import { MANAGE_TAB, SIZE_TAB, SHARE_TAB } from "../../labels/tabLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { getCurrentDBName } from "../../utils/helperFunctions"
import { Tabs, Tab } from 'react-bootstrap-tabs';
import ManageDatabase from './ManageDatabase'
import SizeInfoDatabase from './SizeInfoDatabase'
import AccessDatabase from './AccessDatabase'
import { DateTimeSlider } from '../../components/Slider/DateTimeSlider'
import BranchSelector from '../../components/BranchSelector'

const DatabaseHome = (props) => {
    const { loading, user } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);
	const [dbCLient] = useGlobalState(TERMINUS_CLIENT);

    const toggle = () => setIsOpen(!isOpen);

    if (loading || !user) {
        return <Loading />;
    }

    return (
    	<Container fluid className="h-100 pl-0 pr-0">
            <NavBar/>
    	    <Container className="flex-grow-1">
			 	<hr className = "my-space-50" />
    	  	    <legend>{getCurrentDBName(dbCLient)}</legend>
				<hr className = "my-space-50"/>
				<span className = "d-fl mb-12">
					<Col md={8} className="mb-8">
						<DateTimeSlider/>
					</Col>
					<Col md={1} className="mb-1"/>
					<Col md={3} className="mb-3">
						<BranchSelector/>
					</Col>
				</span>
				<hr className = "my-space-5"/>
				<Tabs>
				    <Tab label = {MANAGE_TAB}>
					    <hr className = "my-space-15"/>
						<ManageDatabase/>
				    </Tab>
				    <Tab label = {SIZE_TAB}>
						<hr className = "my-space-15"/>
						<SizeInfoDatabase/>
					</Tab>
					<Tab label = {SHARE_TAB}>
						<hr className = "my-space-15"/>
						<AccessDatabase/>
					</Tab>
				</Tabs>
    	    </Container>
    	</Container>
    )
}

export default DatabaseHome;
