import React from "react";
import { Card, CardTitle, CardText, CardImg } from "reactstrap";

export const DatabaseCard = (props) => {
    const card = props.card || {}

    return (
        <><hr className = "my-space-100"/>
          <CardTitle className="db-view-card-title">{ card.title }</CardTitle>
          <CardImg top width="100%" src={ card.image }/>
          <CardText className="db-view-card-text">{ card.text }</CardText>
          <hr className = "my-space-25"/></>
    )
}
