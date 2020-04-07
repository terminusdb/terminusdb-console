import React, { useState } from "react";
import { Col, Button } from "reactstrap";
import { queryControls } from "../../variables/formLabels"
import { TABLE, PROJECT_DIAGRAM, VIAL, CANCEL } from '../../labels/iconLabels'
import { AddIcon } from "../../components/LoadFontAwesome"
import { RENDER_TYPE_TABLE, RENDER_TYPE_GRAPH } from "../../labels/renderTypeLabels";
import { ResultPane } from './ResultPane'

export const QueryResults = (props) => {
    const [view, setView] = useState(RENDER_TYPE_GRAPH);
    const [config, viewConfig] = useState(false);
    const results = props.results || {};
    const handleTableView = () => {
        setView(RENDER_TYPE_TABLE);
    }

    const handleGraphView = () => {
        setView(RENDER_TYPE_GRAPH);
    }

    const handleConfig = () => {
        viewConfig(true);
    }

    const handleCancel= () => {
        viewConfig(false);
    }

    return (
         <>
             <span className="d-fl qr-v">
                 <button onClick={handleTableView}
                    className="flatButton">
                    <AddIcon icon= { TABLE }/>
                  </button>
                 <button onClick={ handleGraphView }
                    className="flatButton">
                    <AddIcon icon= { PROJECT_DIAGRAM }/>
                 </button>
                 {(!config) && <button onClick={ handleConfig }
                    className="flatButton">
                    <AddIcon icon= { VIAL }/>
                 </button>}
                 {(config) && <button onClick={ handleCancel }
                    className="flatButton">
                    <AddIcon icon= { CANCEL }/>
                 </button>}
             </span>
             {<ResultPane view={ view } results={ results }
                action = {props.action}
                viewConfig = {config}
                qpNumber={props.qpNumber}/>}
         </>
    )
}
