import React, { useState, useEffect } from 'react';

export const GraphMaker = (props) => {
    //const [edit, setEdit] = useState(false);
    //const [errors, setErrors] = useState()
    const [graphs, setGraphs] = useState(props.graphs)

    useEffect(() => {
        if(props.graphs) setGraphs(props.graphs)
    }, [props.graphs])

    return (
        <div>
            Here goes a list of the current graphs and a form for making new ones
        </div>
    )
}
