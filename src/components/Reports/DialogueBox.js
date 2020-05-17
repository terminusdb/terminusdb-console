import React from "react";
import { Card, CardTitle, CardText, CardImg } from "reactstrap";
import {MASCOT, DIALOGUE_BACKGROUND } from "../../constants/images"

export const DialogueBox = (props) => {
    const msg = props.message || "";
    const header = props.header || false;
    return (
        <Card body outline color="info">
            {header && <>
                <div className='head-bg'><CardImg top width="70%" src={DIALOGUE_BACKGROUND}/></div>
                <CardImg top width="70%" src={MASCOT}/>
                <div className='head-t'>
                    <CardTitle>
                        <h1 className="d-head1"> { header } </h1>
                        <h1 className="d-head2"> { msg } </h1>
                    </CardTitle>
                </div>
            </>}
            {!header && <>
                <CardImg top width="70%" src={MASCOT}/>
                <CardTitle> { msg } </CardTitle>
            </>}
        </Card>
    )
}
