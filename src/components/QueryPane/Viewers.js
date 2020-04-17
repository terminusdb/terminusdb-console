import React, { useState, useEffect } from "react";

export const Viewers = (props) => {
    const views = props.views || [];
    const setCurrentView = props.setCurrentView;

    let viewerPanel = [];
    views.map((items) => {
        viewerPanel.push(<button onClick={ () => { setCurrentView(items)} }>
            { items }</button>);
    })

    return (
        <div className = "viewers">
            {viewerPanel}
        </div>
    )
}
