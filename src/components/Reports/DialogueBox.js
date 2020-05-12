import React from "react";
import dImg from '../../img/placeholders/dialogueBox.png'

export const DialogueBox = (props) => {
    const msg = props.message || "";
    const header = props.header || false;

    return (
        <>{header && <h1 className="d-head1"> {header} </h1>}
        <div className="img-c">
            <img src= {dImg}/>
            <div className="d-b centered"> {msg} </div>
        </div></>
    )
}
