import React, { useState }  from "react";
import { COWDUCK_HELP_ICON } from "../../constants/images"
import { COWDUCK_ICON_CSS, COWDUCK_WRAPPER_CSS } from "./constants"


export const HelpCowDuck = ({className, onHover, onClick}) => {
    className = className || COWDUCK_WRAPPER_CSS
    return (
        <span onHover={onHover} onClick={onClick} className={className}>
            <img src={COWDUCK_HELP_ICON} className={COWDUCK_ICON_CSS} onClick={onClick}/>
        </span>
    )
}
