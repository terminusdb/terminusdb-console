import React from "react";
import { Synchronise } from "./Synchronise"
import { Share } from "./Share"
import { Users } from "./Users"
import { DBContextObj } from "../../components/Query/DBContext"
import Loading from "../../components/Reports/Loading"
import { useAuth0 } from "../../react-auth0-spa";
import {Container, Row, Col } from "reactstrap"
import {COLLABORATE_SECTIONS, COLLABORATE_SOON} from "./constants.dbcollaborate"
import {RiverOfSections} from "../Templates/RiverOfSections"
import { TERMINUS_COMPONENT } from "../../constants/identifiers";
import {ComingSoon} from "../../components/Reports/ComingSoon"

export const Collaborate = (props) => {
    const {repos} = DBContextObj();
	const { user } = useAuth0()

    if(!repos) return (<Loading type={TERMINUS_COMPONENT} />)
    let hasOrigin = repos.local_clone || repos.remote  
    let sections = (hasOrigin ? [COLLABORATE_SECTIONS[0], COLLABORATE_SECTIONS[1]] : [COLLABORATE_SECTIONS[0], COLLABORATE_SECTIONS[2]])
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

            <RiverOfSections sections={sections} label={props.label}>
                <Users key="users"/>
                {hasOrigin && 
                    <Synchronise key="synch" />
                }   
                {!hasOrigin && 
                    <Share key="share" />
                }
            </RiverOfSections>                        
        }
    </>)
}
