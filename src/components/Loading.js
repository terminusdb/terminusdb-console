import React from "react";
import { LOADING_SPINNER } from "../constants/images"
import { SITE_LOADING, PAGE_LOADING, COMPONENT_LOADING } from "../constants/css"
import { IS_LOADING } from "../constants/text"
import { TERMINUS_COMPONENT, TERMINUS_PAGE,  } from "../constants/identifiers"

const Loading = ({type}) => {   
    let css = (type == TERMINUS_COMPONENT ? COMPONENT_LOADING : 
            (type == TERMINUS_PAGE ? PAGE_LOADING : SITE_LOADING))
    return (
        <div className={css}>
            <img src={LOADING_SPINNER} alt={IS_LOADING} />
        </div>
    )
}

export default Loading;
