/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { TCSubmitWrap } from  "../../../components/Form/FormComponents"
import { FORK_BUTTON } from "../constants"
import { Button } from "reactstrap";
import { ComingSoon } from "../../../components/Reports/ComingSoon"


export const ForkBranch = ({onCancel, onCreate, onEdit, visible, report}) => {
    visible = visible || false
    const [isVisible, setVisible] = useState(visible)

    if(!isVisible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={() => setVisible(true)} outline color="secondary">
                    {FORK_BUTTON}
                </Button>
            </TCSubmitWrap>            
        )
    }

    return (
        <ComingSoon />       
    )
}