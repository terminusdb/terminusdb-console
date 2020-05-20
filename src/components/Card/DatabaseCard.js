import React from "react";
import { Card, CardTitle, CardText, CardImg } from "reactstrap";

export const DatabaseCard = (props) => {
    const card = props.card || {}

    return (
    	<div className="contentSquare">
    		<h2 className="mb-4 db-view-card-title">{ card.title }</h2>
    		<img src={ card.image } width="40%" height="auto"></img>
    		<p className="db-view-card-text">{ card.text }</p>
    	</div>
       
    )
}

/* <><hr className = "my-space-100"/>
          <CardTitle className="db-view-card-title">{ card.title }</CardTitle>
          <CardImg top src={ card.image }/>
          <CardText className="db-view-card-text">{ card.text }</CardText>
          <hr className = "my-space-25"/></>*/