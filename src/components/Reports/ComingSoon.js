
import React from "react"
import {COMING_SOON, MASCOT_COLOR} from "../../constants/images"


export const ComingSoon = (props) => {
    let cname = ((props && props.size == "small") ? "terminus-mini-coming-soon" : "terminus-coming-soon")
    let csClassName = ((props && props.size == "small") ? "terminus-mini-coming-soon-msg" :  "cms-i")
    let cdClassName = ((props && props.size == "small") ? "terminus-mini-coming-soon-cd" : "cms-i")
     
    return (
        <span width ="100%" className={cname}> 
            <img className={csClassName} src={COMING_SOON}/>
            <img className={cdClassName} src={MASCOT_COLOR}/>
        </span>
    )
}