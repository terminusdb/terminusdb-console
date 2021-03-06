import React from "react";
import { PageView } from "./PageView"
import {PAGEVIEW} from "./constants.templates"
/**
 * Generates a simple page view, single pane of content
 */

export const SimplePageView = ({children, onHeadChange, loading, report}) => {
    return (
        <PageView onHeadChange={onHeadChange} loading={loading} report={report}>
                {children}
        </PageView>
    )
}