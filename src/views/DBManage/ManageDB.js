import React from "react";
import { Branch } from "./Branch"
import { Merge } from "./Merge"
import { Metadata } from "./Metadata"
import { Backup } from "./Backup"
import { DeleteDB } from "./DeleteDB"
import { MANAGE_SECTIONS } from "./constants.dbmanage"
import { RiverOfSections } from "../Templates/RiverOfSections"
import {PageView} from "../Templates/PageView"


export const ManageDB = (props) => {
    return (
    	<PageView report={props.report} dbPage={true}>
	        <RiverOfSections key='a' sections={MANAGE_SECTIONS} label={props.label}>
	            <Branch key="branch" />
	            <Merge key="merge" />
	            <DeleteDB key="deletedb" modal/>
	        </RiverOfSections>
	    </PageView>
    )
}

