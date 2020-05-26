import React from "react";
import { Branch } from "./Branch"
import { Merge } from "./Merge"
import { Metadata } from "./Metadata"
import { Backup } from "./Backup"
import { DeleteDatabase } from "./DeleteDatabase"
import { MANAGE_SECTIONS } from "./constants.dbmanage"
import { RiverOfSections } from "../Templates/RiverOfSections"

const ManageDatabase = (props) => {
    return (
        <RiverOfSections sections={MANAGE_SECTIONS}>
            <Metadata key="metadata"/>
            <Branch key="branch" />
            <Merge key="merge" />
            <Backup key="backup" />
            <DeleteDatabase key="deletedb"/>
        </RiverOfSections>
    )
}

export default ManageDatabase;
