import React from "react";
import { Users } from './Users'
import { Capabilities } from './Capabilities'
import { UserCapabilities } from './UserCapabilities'
import { AddUser } from './AddUser'
import { TabbedPageView } from '../Templates/TabbedPageView'
import { CreateCapability } from './CreateCapability'
import { GrantCapability } from './GrantCapability'
import { GrantAccess } from './GrantAccess'
import { CreateAccess } from './CreateAccess'
import { RevokeCapability } from './RevokeCapability'

export const ManageUsers = (props) => {
    let sections = [
        {id: "users" , label: "Users"}, 
        {id: "capabilities", label: "Capabilities" },
        {id: "usercapabilities", label: "User Capabilities" }, 
        {id: "adduser", label: "Add User" }, 
        {id: "createcap", label: "Create Capability" }, 
        {id: "createaccess", label: "Create Access Token" }, 
        {id: "grantaccess", label: "Grant Access Token" }, 
        {id: "grantcapability", label: "Grant Capability" }, 
        {id: "revokegrant", label: "Revoke Capability" }, 
    ]

    let report = null

    return (  
        <TabbedPageView sections={sections} active={props.page} report={report}>            
            <Users key="users" label="Users" />
            <Capabilities key="caps" label="Capabilities" />
            <UserCapabilities key="ucaps" label="User Capabilities" />
            <AddUser key="addu" label="Add User" />
            <CreateCapability key="createcap" label="Create Capability" />
            <CreateAccess key="createacc" label="Create Access Token" />
            <GrantAccess key="grantacc" label="Grant Access Token" />
            <GrantCapability key="grant" label="Grant Capability" />
            <RevokeCapability key="revoke" label="Revoke Capability" />
        </TabbedPageView>        
	)
}

