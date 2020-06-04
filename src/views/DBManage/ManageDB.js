import React from "react";
import { Branch } from "./Branch"
import { Merge } from "./Merge"
import { Metadata } from "./Metadata"
import { Backup } from "./Backup"
import { DeleteDB } from "./DeleteDB"
import { MANAGE_SECTIONS } from "./constants.dbmanage"
import { RiverOfSections } from "../Templates/RiverOfSections"

export const ManageDB = (props) => {
    return (
        <RiverOfSections sections={MANAGE_SECTIONS} label={props.label}>
            <Branch key="branch" />
            <Merge key="merge" />
            <Backup key="backup" />
            <DeleteDB key="deletedb" modal/>
        </RiverOfSections>
    )
}

