import React from "react";
import { LOADING_SPINNER } from "../../constants/images"
import { SITE_LOADING, PAGE_LOADING, COMPONENT_LOADING } from "../../constants/css"
import { IS_LOADING } from "../../constants/text"
import { TERMINUS_COMPONENT, TERMINUS_PAGE,  } from "../../constants/identifiers"

const Loading = ({type,loadingMessage}) => {
    let css = (type == TERMINUS_COMPONENT ? COMPONENT_LOADING :
            (type == TERMINUS_PAGE ? PAGE_LOADING : SITE_LOADING))
    ///
    return (
        <div className="tdb__loading" id="loading">
            <img src={LOADING_SPINNER} alt={IS_LOADING} />
            {loadingMessage && <span className="tdb__loading__message">{loadingMessage}</span>}
        </div>
    )
}

export default Loading;
