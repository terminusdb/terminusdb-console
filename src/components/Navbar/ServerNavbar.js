import React, {useState} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {NavLink} from 'react-router-dom'
import {SERVER_ROUTE} from '../../constants/routes'
import {AiOutlineInfoCircle} from "react-icons/ai"
import packageJson from '../../../package.json';

//import {Modal, ModalHeader, ModalBody, Row, Col} from 'reactstrap';
import {Modal, ModalHeader, ModalBody, Row, Col} from 'react-bootstrap';

export const ServerNavbar = (props) => {
    const {woqlClient} = WOQLClientObj()
    const [serverVersion, setServerVersion]=useState(false)
    const [modal, setModal] = useState(false);

    const toggle = async() => {
        let serverVersion=await woqlClient.info().then((results) => {
            setModal(!modal)
            setServerVersion(results["api:info"].terminusdb.version)
        })
    };

    const handleClick = () => {
        //clear the database context
        woqlClient.connectionConfig.clearCursor()
    }

    return (
        <div className="nav__main__left">
            <NavLink to={SERVER_ROUTE} className="nav__main__logo" onClick={handleClick}>
                <img src="https://terminusdb.com/img/logos/logo.svg" alt="Terminus DB logo" />
            </NavLink>
            <span title="Version Info" className="version-info" onClick={toggle}>
                <AiOutlineInfoCircle color="#fff"/>
            </span>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle} className="version-info-align version-info-col">About TerminusDB Console</ModalHeader>
                <ModalBody>
                    <Row style={{width: "100%"}}>
                        <Col md={5} className="version-info-align version-info-col">
                            Console Version
                        </Col>
                        <Col md={6} className="version-info-align">
                            {packageJson.version}
                        </Col>
                    </Row>
                    <Row style={{width: "100%"}}>
                        <Col md={5} className="version-info-align version-info-col">
                            Server Version
                        </Col>
                        <Col md={6} className="version-info-align">
                            {serverVersion}
                        </Col>
                    </Row>
                    <Row style={{width: "100%"}}>
                        <Col md={5} className="version-info-align version-info-col">
                            Server Url
                        </Col>
                        <Col md={6} className="version-info-align">
                            {woqlClient.connectionConfig.serverURL()}
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    )
}
