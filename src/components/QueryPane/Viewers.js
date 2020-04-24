import React, { useState, useEffect } from "react";

export const Viewers = (props) => {
    const views = props.views || [];
    const setViewer = props.setViewer;

    let viewerPanel = [];
    views.map((items) => {
        viewerPanel.push(<button onClick={ () => { setViewer(items)} }>
            { items }</button>);
    })

    return (
        <div className = "viewers">
            {viewerPanel}
        </div>
    )
}
