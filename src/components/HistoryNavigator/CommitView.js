import React, { useState, useEffect } from "react";
import { nextCommit, previousCommit } from "../../variables/formLabels"

export const CommitView = (props) => {

    const setRef = props.setRef || new Date();
    const parent = props.parent || false;
    const child = props.child || false;

    const handlePreviousCommit = () => {
        setRef(parent);
	}

	const handleNextCommit = () => {
        setRef(child);
	}

    return (
        <span className = "d-fl mb-8 cc">
            <button onClick={handleNextCommit}>
                { nextCommit.text }
            </button>
            <button onClick={handlePreviousCommit}>
                { previousCommit.text }
            </button>
        </span>
    )
}
