import React, { useState }  from "react";
import { COWDUCK_HELP_ICON } from "../../constants/images"
import { COWDUCK_ICON_CSS, COWDUCK_WRAPPER_CSS, ASK_COWDUCK } from "./constants"


export const HelpCowDuck = ({className, title, onHover, endHover, onClick}) => {
    className = className || COWDUCK_WRAPPER_CSS
    title = title || ASK_COWDUCK 
    return (
        <span onMouseOver={onHover}  onMouseOut={endHover} onClick={onClick} className={className}>
            <img src={COWDUCK_HELP_ICON} className={COWDUCK_ICON_CSS} title={title}/>
        </span>
    )
}
