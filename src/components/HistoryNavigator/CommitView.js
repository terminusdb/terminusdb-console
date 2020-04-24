import React from "react";
import { CommitViewerText } from "../../variables/formLabels"
import { Container, Row, Col } from "reactstrap";
import Loading from "../../components/Loading";
import { format } from "date-fns";

export const CommitView = (props) => {

    function handleNextCommit(){
        props.setRef(props.commit.child)
    }

    function handlePreviousCommit(){
        props.setRef(props.commit.parent)
    }

    if(!props.commit) return (<Loading />)
    return (
        <span className = "d-fl mb-12">
            <Col md={9} className="mb-9">
               <Container>
                    <Row>
                        <Col sm={2}>
                            {CommitViewerText.time.text } 
                        </Col>
                        <Col sm={3}>
                            {CommitViewerText.id.text } 
                        </Col>
                        <Col sm={2}>
                            {CommitViewerText.author.text } 
                        </Col>
                        <Col sm={4}>
                            {CommitViewerText.message.text } 
                        </Col>               
                    </Row>
                    <Row style={{"font-size": "0.8em", overflow: "hidden"}}>
                        <Col sm={2}>
                            {format(new Date(props.commit.time * 1000),"dd-MMM-yy HH:mm:ss")}        
                        </Col>
                        <Col sm={3}>
                            {props.commit.id}        
                        </Col>
                        <Col sm={2}>
                            {props.commit.author}        
                        </Col>
                        <Col sm={4}>
                            {props.commit.message}        
                        </Col>
                    </Row>                
                </Container>
            </Col>
            <Col md={3} className="mb-3">
                { props.commit.child && 
                    <button onClick={handleNextCommit}>
                        { CommitViewerText.next.text }
                    </button>
                }
                { props.commit.parent && 
                <button onClick={handlePreviousCommit}>
                        { CommitViewerText.previous.text }
                </button>
                }
            </Col>
        </span>
    )
}

export default CommitView;