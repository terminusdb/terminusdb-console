/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { TCSubmitWrap } from  "../../../components/Form/FormComponents"
import { PREFIXES_BUTTON } from "../constants"
import { Button } from "reactstrap";
import { PrefixManager } from "../../Schema/PrefixManager"


export const ManagePrefixes = ({onCancel, onCreate, onEdit, visible, report}) => {
    visible = visible || false
    const [isVisible, setVisible] = useState(visible)

    if(!isVisible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={() => setVisible(true)} outline color="secondary">
                    {PREFIXES_BUTTON}
                </Button>
            </TCSubmitWrap>            
        )
    }

    return (
        <PrefixManager />
    )
}