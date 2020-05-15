import React, { useState } from "react";
import { CommitViewerText } from "../../variables/formLabels"
import { Container, Row, Col } from "reactstrap";
import {printts, DATETIME_FULL} from "../../utils/dateFormats"

export const CommitView = (props) => {
    if(!props.commit) return <div/>
    let cmsg = ""
    if(props.commit.message) cmsg = (props.commit.message.length > 80 ? props.commit.message.substring(0, 76) + " ..." : props.commit.message)
    let cauth = ""
    if(props.commit.author) cauth = (props.commit.author.length > 18 ? props.commit.author.substring(0, 15) + " ..." : props.commit.author)
    const ts = printts(props.commit.time, DATETIME_FULL)
    const title = `ID: ${props.commit.id}
Author: ${cauth}
Time: ${ts}
Message: ${cmsg}`
    return (
        <div title={title}>
            <div className="commit-view-header">
                { ts + " - " + props.commit.author}
            </div>
            <div className="commit-view-message">
                {cmsg}
            </div>
        </div>
    )
}


