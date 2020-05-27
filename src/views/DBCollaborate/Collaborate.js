import React, {useState} from "react";
import { useAuth0 } from "../../react-auth0-spa";
import { useForm } from 'react-hook-form';
import { Container,Row, Col } from "reactstrap";
import { ComingSoon } from "../../components/Reports/ComingSoon"
import { Pull } from "./Pull"
import { Push } from "./Push"
import { Share } from "./Share"
import { Users } from "./Users"


import {COLLABORATE_SECTIONS, COLLABORATE_SOON} from "./constants.dbcollaborate"
import {RiverOfSections} from "../Templates/RiverOfSections"

export const Collaborate = (props) => {
    const { register, handleSubmit, errors } = useForm();
	const { isAuthenticated, user } = useAuth0()


    return (<>
            {!user && 
                <div>
                    <hr className="my-space-50"/>
                        <Container>
                        <Row>
                            <Col md={4} className={COLLABORATE_SOON.intro}>
                                <ComingSoon size="small"/>
                            </Col>
                            <Col md={2} className={COLLABORATE_SOON.box}>
                                <Row className={COLLABORATE_SOON.top}>Share your database on Terminus DB Hub</Row>
                                <Row className={COLLABORATE_SOON.bottom}><div className={COLLABORATE_SOON.button}>Share</div></Row>
                            </Col>
                            <Col md={2} className={COLLABORATE_SOON.box}>
                                <Row className={COLLABORATE_SOON.top}>Push updates to your collaborators</Row> 
                                <Row className={COLLABORATE_SOON.bottom}><div className={COLLABORATE_SOON.button}>Push</div></Row>
                            </Col>
                            <Col md={2} className={COLLABORATE_SOON.box}>
                                <Row className={COLLABORATE_SOON.top}>Pull updates from collaborators</Row>
                                <Row className={COLLABORATE_SOON.bottom}><div className={COLLABORATE_SOON.button}>Pull</div></Row> 
                            </Col>
                            <Col md={2} className={COLLABORATE_SOON.box}>
                                <Row className={COLLABORATE_SOON.top}>Build data operations pipelines</Row>
                                <Row className={COLLABORATE_SOON.bottom}><div className={COLLABORATE_SOON.button}>Pipeline</div></Row>
                            </Col>
                        </Row>
                    </Container>
                </div>
            }
			{user && 
                <RiverOfSections sections={COLLABORATE_SECTIONS} label={props.label}>
                    <Users key="users"/>
                    <Push key="push" />
                    <Pull key="pull" />
                    <Share key="share" />
                </RiverOfSections>                        
            }
        </>
    )
}

