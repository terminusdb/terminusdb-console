/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { TCSubmitWrap } from  "../../../components/Form/FormComponents"
import { GRAPHS_BUTTON } from "../constants"
import { Button } from "reactstrap";
import { ComingSoon } from "../../../components/Reports/ComingSoon"
import { GraphMaker } from "../../Schema/GraphMaker"

export const ManageGraphs = ({onCancel, onCreate, onEdit, visible, report}) => {
    visible = visible || false
    const [isVisible, setVisible] = useState(visible)

    const [graphs, setGraphs] = useState(false)

    function graphUpdated(){
        alert("graph was updated")
    }

    if(!isVisible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={() => setVisible(true)} outline color="secondary">
                    {GRAPHS_BUTTON}
                </Button>
            </TCSubmitWrap>            
        )
    }

    return (
        <GraphMaker graphs={graphs} onUpdate={graphUpdated}/>
    )
}