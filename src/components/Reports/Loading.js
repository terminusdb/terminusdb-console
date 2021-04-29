import React from "react";
import { LOADING_SPINNER } from "../../constants/images"
import { SITE_LOADING, PAGE_LOADING, COMPONENT_LOADING } from "../../constants/css"
import { IS_LOADING } from "../../constants/labels"
import { TERMINUS_COMPONENT, TERMINUS_PAGE,  TERMINUS_TABLE} from "../../constants/identifiers"

const Loading = ({type, loadingMessage}) => {
    let css = (type == TERMINUS_COMPONENT ? COMPONENT_LOADING :
            (type == TERMINUS_PAGE ? PAGE_LOADING : SITE_LOADING))
    ///
    let loadingCss = (type == TERMINUS_TABLE) ? "tdb__tab__loading": "tdb__loading"

    return (
        <div className={loadingCss} id="loading">
            <img src={LOADING_SPINNER} alt={IS_LOADING} />
            {loadingMessage && <span className="tdb__loading__message">{loadingMessage}</span>}
        </div>
    )
}

export default Loading;
