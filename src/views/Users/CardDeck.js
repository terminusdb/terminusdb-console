import React from 'react';
import { Card, Button, CardImg, CardTitle, CardText, CardDeck,
CardSubtitle, CardBody } from 'reactstrap';
import { FREE_PLAN, PRO_PLAN } from "./variables/pricingPlan"

export const CardDecks = () => {
    const freePlanText = [], proPlanText = [];

    for (const [index, value] of FREE_PLAN.text.entries()) {
        freePlanText.push(<CardText key = {index}>{ FREE_PLAN.text[index] }</CardText>)
    }
    for (const [index, value] of PRO_PLAN.text.entries()) {
        proPlanText.push(<CardText key = {index}>{ PRO_PLAN.text[index] }</CardText>)
    }

    //some mechanism to unserstand current plan and set classname
    const freePlanCurr = "curr-pr";
    const proPlanCurr = '';

    return (
            <CardDeck>
              <Card className={freePlanCurr}>
                <CardImg top width="100%" src="https://terminusdb.com/img/cards/card-shape-1.svg"alt="Card image cap" />
                <CardBody className="free-p-div">
                  <CardTitle>{ FREE_PLAN.title }</CardTitle>
                  <CardSubtitle>{ FREE_PLAN.subtitle }</CardSubtitle>
                  {freePlanText}
                </CardBody>
              </Card>
              <Card className={proPlanCurr}>
                <CardImg top width="100%" src="https://terminusdb.com/img/cards/card-shape-3.svg" alt="Card image cap" />
                <CardBody>
                  <CardTitle>{ PRO_PLAN.title }</CardTitle>
                  <CardSubtitle>{ PRO_PLAN.subtitle }</CardSubtitle>
                  {proPlanText}
                </CardBody>
              </Card>
            </CardDeck>
    )
}
