import React from "react"
import {CONNECTING_MESSAGE} from "./constants.reports"
import Loading from "./Loading"

const LoadingAppPage = () => {
    return (
        <div>
            <span>{CONNECTING_MESSAGE}</span>
            <Loading />
        </div>
    )
}

export default LoadingAppPage