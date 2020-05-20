import React from "react";
import { DialogueBox } from "./DialogueBox"
import { SERVER_ACCESS_CONTROL_FAILURE_ADVICE, SERVER_ACCESS_CONTROL_FAILURE } from "./constants"

const AccessControlErrorPage = () => {
    return (
        <DialogueBox message = { SERVER_ACCESS_CONTROL_FAILURE_ADVICE}
            header = {SERVER_ACCESS_CONTROL_FAILURE} />
    )
}

export default AccessControlErrorPage;
