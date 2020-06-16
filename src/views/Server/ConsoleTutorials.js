import React from "react";
import { TUTORIAL_SECTIONS } from "./constants.server"
import { RiverOfSections } from "../Templates/RiverOfSections"

export const ConsoleTutorials = (props) => {
    return (
        <RiverOfSections sections={TUTORIAL_SECTIONS} label="Tutorials">
            <PopupVideo key='v1' video="intro" />
            <PopupVideo key='v4' video="collaboration" />
            <PopupVideo key='v2' video="timetravel" />
            <PopupVideo key='v3' video="branchmerge" />
            <PopupVideo key='v5' video="pushpull" />
            <PopupVideo key='v6' video="importing" />
            <PopupVideo key='v7' video="query" />
            <PopupVideo key='v8' video="schema" />
        </RiverOfSections>
    )
}

export const PopupVideo = ({video}) => { 
    alert("Launch video " + video + " here")
    return (<div>{video} video goes here</div>)
}
