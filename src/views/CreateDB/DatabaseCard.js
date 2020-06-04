import React from "react";
import { DBCARD_IMG_CSS, DBCARD_CONTAINER_CSS, DBCARD_TITLE_CSS, DBCARD_BODY_CSS } from "./constants.createdb";

export const DatabaseCard = (props) => {
    const card = props.card || {}

    return (
    	<div className={DBCARD_CONTAINER_CSS}>
    		<h2 className={DBCARD_TITLE_CSS}>
                { card.title }
            </h2>
    		<img className={DBCARD_IMG_CSS} src={ card.image } width="40%" height="auto"></img>
    		<p className={DBCARD_BODY_CSS}>
                { card.text }
            </p>
    	</div>
    )
}
