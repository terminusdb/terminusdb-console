import React from "react";
import { PageView } from "./PageView"

/**
 * Generates a simple page view, single pane of content
 */

export const SimplePageView = ({children, onHeadChange, loading, report}) => {
    return (
        <PageView onHeadChange={onHeadChange} loading={loading} report={report}>
            <div className = {PAGE_CONTENT_CSS}>
                <hr className = "my-space-15"/>
                {children}
            </div>
        </PageView>
    )
}