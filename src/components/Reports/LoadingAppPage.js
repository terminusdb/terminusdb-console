import React from "react"
import {CONNECTING_MESSAGE} from "./constants.reports"
import Loading from "./Loading"

const LoadingAppPage = () => {
    return (
            <Loading  loadingMessage={CONNECTING_MESSAGE}/>
    )
}

export default LoadingAppPage