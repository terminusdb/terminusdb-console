import { DialogueBox } from "./DialogueBox"
import React from "react";
import { ACCESS_FAILURE, CONNECTION_FAILURE } from "../../constants/identifiers"
import { AccessControlErrorPage } from "./AccessControlErrorPage";

export const PageFailure = ({failure, report}) => {
    if(failure == ACCESS_FAILURE){
        return (<AccessControlErrorPage />)
    }
    else if(failure == CONNECTION_FAILURE){
        return (<ConnectionErrorPage />)
    }
    return (
        <DialogueBox message={failure.message} header={failure.title} color="danger" report={report} />
    )
}