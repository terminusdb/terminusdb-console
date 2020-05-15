import React from "react";
import { Col, Card, CardTitle, CardText, CardImg } from "reactstrap";

const mascotImg = "https://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png"
const bg = "https://assets.terminusdb.com/terminusdb-console/images/card-shape-3.svg"

export const DialogueBox = (props) => {
    const msg = props.message || "";
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
