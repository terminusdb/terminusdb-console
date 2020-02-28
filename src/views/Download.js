import React, {useState} from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";

import NavBar from '../components/NavBar'
import {downloadTerminusDBLabels} from '../variables/content'
import Windows_logo from "../img/windows_logo.png"
import Linux_logo from "../img/linux_logo.png"
import Apple_logo from "../img/apple_logo.png"

const LINUX_VERSION="LINUX_VERSION";
const WINDOWS_VERSION="WINDOWS_VERSION";
const APPLE_VERSION="APPLE_VERSION";

//https://auth0.com/docs/api-auth/user-consent
const Download = (props) => {

	const opSystem=window.navigator.platform;

	let startVersion =LINUX_VERSION;

	//if(opSystem.2)

	const [currentOpen, docOpen] = useState(startVersion);

	const setSysType=(evt)=>{
		docOpen(evt.currentTarget.id)
	}

	const appSelectClassName=currentOpen===APPLE_VERSION ? "sys_box box--with-shadow selected" :"sys_box box--with-shadow"
	const linuxSelectClassName=currentOpen===LINUX_VERSION ? "sys_box box--with-shadow selected" :"sys_box box--with-shadow"
	const windSelectClassName=currentOpen===WINDOWS_VERSION ? "sys_box box--with-shadow selected" :"sys_box box--with-shadow"


	return(
		<Container fluid className="h-100 pl-0 pr-0">
	    	<NavBar />
	  		<Container className="flex-grow-1 pt-5">
	  	 		<Col className="pt-5">
	  	  		<h4>{downloadTerminusDBLabels.title}</h4>
	  	  		<p>{downloadTerminusDBLabels.mainDescription}</p>
	  	  		<hr className="my-2" />
	  	  		<h3 className="pt-4 pb-2 h3 box__title">{downloadTerminusDBLabels.operativeTitle}</h3>
	  	  		<Row className="mt-12 mb-4">
	  	  			<Col className="mt-4">
	  	  				<div id={APPLE_VERSION} className={appSelectClassName} onClick={setSysType}>
	  	  					<img src={Apple_logo} className="sys_logo"/>
	  	  					<span className="h3 box__title">Mac OS </span>
	  	  				</div>
	  	  			</Col>
	  	  			<Col className="mt-4 ">
	  	  				<div id={LINUX_VERSION} className={linuxSelectClassName} onClick={setSysType}>
	  	  					<img src={Linux_logo} className="sys_logo"/>
	  	  					<span className="h3 box__title"> Linux </span>
	  	  				</div>
	  	  			</Col>
	  	  			<Col className="mt-4" >
	  	  				<div id="WINDOWS_VERSION" className={windSelectClassName} onClick={setSysType}>
	  	  					<img src={Windows_logo} className="sys_logo"/>
	  	  					<span className="h3 box__title" > Windows </span>
	  	  				</div>
	  	  			</Col>
	  	  		</Row>
	  	  		<hr className="my-2" />
	  	  		<Row className="mt-12">
	  	  			<Col className="mt-12">
	  	  				<Collapse isOpen={currentOpen===LINUX_VERSION} className="p-4">
	  	  					<h3 className="h3 box__title">Install TerminusDB in Linux</h3>
	  	  					<h5 className="h5">Prerequisites</h5>
	  	  					<hr className="my-2" />
	  	  					<p className="box__text">
		  	  					{downloadTerminusDBLabels.pre_linux_text}
		  	  					<a href={downloadTerminusDBLabels.pre_linux_docker_link} target="_blank" >
		  	  						{downloadTerminusDBLabels.pre_linux_docker_link}
		  	  					</a>
	  						</p>

					 	</Collapse>
	  	  			</Col>
	  	  		</Row>
	  	  		<Row className="mt-12">
	  	  			<Col className="mt-12">
	  	  				<Collapse isOpen={currentOpen===APPLE_VERSION} className="p-4" >
	  	  					<h3 className="h3 box__title">Install TerminusDB in MAC OS</h3>

					 	</Collapse>
	  	  			</Col>
	  	  		</Row>
	  	  		<Row className="mt-12">
	  	  			<Col className="mt-12">
	  	  				<Collapse isOpen={currentOpen===WINDOWS_VERSION} className="p-4">
	  	  					<h3 className="h3 box__title">Install TerminusDB in Windows</h3>

					 	</Collapse>
	  	  			</Col>
	  	  		</Row>
	  	  		</Col>
	  	  	</Container>
  	  	</Container>

	)

}

export default Download;
