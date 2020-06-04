import React from "react";
import {printts, DATETIME_FULL} from "../../constants/dates"
import {COMMIT_VIEW} from "./constants.history"

export const CommitView = (props) => {
    function getEmpty(){
        return(
            <div>
                <div className={COMMIT_VIEW.headerClassName}>
                    ...
                </div>
                <div className={COMMIT_VIEW.messageClassName}>
                    Searching Commit Log
                </div>
            </div>
        )
    }

    if(!props.commit) return getEmpty()
    let cmsg = ""
    if(props.commit.message) cmsg = (props.commit.message.length > COMMIT_VIEW.maxlen ? props.commit.message.substring(0, COMMIT_VIEW.maxlen-4) + " ..." : props.commit.message)
    let cauth = ""
    if(props.commit.author) cauth = (props.commit.author.length > COMMIT_VIEW.authorMaxlen ? props.commit.author.substring(0, COMMIT_VIEW.authorMaxlen-4) + " ..." : props.commit.author)
    const ts = printts(props.commit.time, DATETIME_FULL)
    const title = `${COMMIT_VIEW.idLabel}: ${props.commit.id}
${COMMIT_VIEW.authorLabel}: ${cauth}
${COMMIT_VIEW.timeLabel}: ${ts}
${COMMIT_VIEW.messageLabel}: ${cmsg}`
    return (
        <div title={title}>
            <div className={COMMIT_VIEW.headerClassName}>
                { ts + " - " + props.commit.author}
            </div>
            <div className={COMMIT_VIEW.messageClassName}>
                {cmsg}
            </div>
        </div>
    )
}


