import React from "react";
import { Col, Card, CardTitle, CardText, CardImg } from "reactstrap";
import mascotImg from "../img/mascot/Mascot-Color.png"
import bg from "../img/cards/card-shape-3.svg"
import * as tags from "../labels/tags"

export const DialogueBox = (props) => {
    const msg = props.message || tags.BLANK;
    const header = props.header || false;

    return (
        <Card body outline color="info">
            {header && <>
                <div className='head-bg'><CardImg top width="70%" src={bg}/></div>
                <CardImg top width="70%" src={mascotImg}/>
                <div className='head-t'>
                    <CardTitle>
                        <h1 className="d-head1"> { header } </h1>
                        <h1 className="d-head2"> { msg } </h1>
                    </CardTitle>
                </div>
            </>}
            {!header && <>
                <CardImg top width="70%" src={mascotImg}/>
                <CardTitle> { msg } </CardTitle>
            </>}
        </Card>
    )
}
