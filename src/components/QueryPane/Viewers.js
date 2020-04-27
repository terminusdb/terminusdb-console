import React, { useState, useEffect } from "react";
import * as viewLabels from "../../labels/viewLabels"
import TerminusClient from '@terminusdb/terminus-client';

export const Viewers = (props) => {
    const views = props.views || [];
    const setViewer = props.setViewer;
    const setRule = props.setRule;

    const view = TerminusClient.View;

    let viewerPanel = [];
    views.map((items) => {
        viewerPanel.push(<button key= {items} onClick={ () => {
            setViewer(items);
            switch(items){
                case viewLabels.TABLE_VIEW:
                    setRule(view.table());
                break;
                case viewLabels.GRAPH_VIEW:
                    setRule(view.graph());
                break;
            }
         } }>
            { items }</button>);
    })

    return (
        <div className = "viewers">
            {viewerPanel}
        </div>
    )
}
