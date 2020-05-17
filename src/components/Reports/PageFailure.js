import { DialogueBox } from "./DialogueBox"
import React from "react";

import {ViolationReport} from "./ViolationReport"

export const PageFailure = ({failure, report}) => {
    return (
        <DialogueBox message={failure.message} header={failure.title} color={failure.color} />
    )
}