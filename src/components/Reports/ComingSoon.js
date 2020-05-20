
import React from "react"

const mascotImg = "https://assets.terminusdb.com/terminusdb-console/images/Mascot-Color.png";
const cmsImg1 = "https://assets.terminusdb.com/terminusdb-console/images/comingSoon.png";

export const ComingSoon = () => {
    return (
        <span width ="100%" className="terminus-coming-soon"> 
            <img src={cmsImg1} className="cms-i"/>
            <img src={mascotImg} className="cms-i"/>
        </span>
    )
}