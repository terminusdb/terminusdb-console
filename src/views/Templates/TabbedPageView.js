import React from "react";
import { TabbedSections } from "./TabbedSections";
import { PageView } from "./PageView"

/**
 * Generates a tabbed page view basic structure for all pages on console
 */
export const TabbedPageView = ({children, onHeadChange, loading, report, active, sections}) => {
    let pv = (
        <PageView 
            onHeadChange={onHeadChange}
            loading={loading}
            report={report}
        >
            <TabbedSections
                id="terminus-tabbed-page"
                sections={sections}
                active={active}
                report={internalReport}
            >
                {children}
            </TabbedSections>
        </PageView>
    )
    return pv
}