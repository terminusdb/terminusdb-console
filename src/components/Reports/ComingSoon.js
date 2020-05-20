
import React from "react"

const mascotImg = "https://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png";
const cmsImg1 = "https://assets.terminusdb.com/terminusdb-console/images/comingSoon.png";

export const ComingSoon = (props) => {
    let cname = ((props && props.size == "small") ? "terminus-mini-coming-soon" : "terminus-coming-soon")
    let csClassName = ((props && props.size == "small") ? "terminus-mini-coming-soon-msg" :  "cms-i")
    let cdClassName = ((props && props.size == "small") ? "terminus-mini-coming-soon-cd" : "cms-i")
     
    return (
        <span width ="100%" className={cname}> 
            <img className={csClassName} src={cmsImg1}/>
            <img className={cdClassName} src={mascotImg}/>
        </span>
    )
}