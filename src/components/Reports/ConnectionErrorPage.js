import React from "react";
import { DialogueBox } from "./DialogueBox"
import { CONNECTION_FAILURE, CONNECTION_FAILURE_ADVICE } from "./constants"

const ConnectionErrorPage = () => {
    return (
        <DialogueBox message = { CONNECTION_FAILURE_ADVICE}
            header = {CONNECTION_FAILURE}/>
    )
}

export default ConnectionErrorPage;
