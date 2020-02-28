import React from "react";
import { ListGroupItem, Col, Row, Container,ListGroup,Jumbotron} from "reactstrap";


const ListGroupItemObject=(props)=>{

	return (<Row className="border-top border-left border-right p-4 row">
				<h5 className="mb-2">{props.heading}</h5>
				<div className="d-flex text-box">
					<p style={{whiteSpace: "pre-line"}}>{props.text}</p>
				</div>
			</Row>)

}

const ContentList = (props) => {

	const items=props.items || []

	return (<Col className="border-bottom">
		      {items.map((item)=>{
		      	return <ListGroupItemObject {...item}/>
		      })}
			</Col>
  	)
}

export default ContentList