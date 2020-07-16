import React from 'react'
import {Users} from './Users'
import {Organizations} from './Organizations'
import {AddOrganization} from './AddOrganization'
import {Roles} from './Roles'
import {UserRoles} from './UserRoles'
import {AddUser} from './AddUser'
import {TabbedSections} from '../Templates/TabbedSections'
import {CreateRole} from './CreateRole'
import {GrantRole} from './GrantRole'
import {GrantCapability} from './GrantCapability'
import {CreateCapability} from './CreateCapability'
import {RevokeRole} from './RevokeRole'

export const ManageUsers = (props) => {
    let sections = [
        {id: 'users', label: 'Users'},
        {id: 'organizations', label: 'Organizations'},
        {id: 'roles', label: 'Roles'},
        {id: 'userroles', label: 'User Roles'},
        {id: 'adduser', label: 'Add User'},
        {id: 'addorg', label: 'Add Organization'},
        {id: 'createrole', label: 'Create Role'},
        {id: 'createcap', label: 'Create Capability'},
        {id: 'grantaccess', label: 'Grant Capability'},
        {id: 'grantcapability', label: 'Grant Role'},
        {id: 'revokegrant', label: 'Revoke Role'},
    ]

    let report = null

    return (
        <div className='manage-users-temp'>
            <hr className="my-space-50" />
            <TabbedSections sections={sections} active={props.page} report={report}>
                <Users key="users" label="Users" />
                <Organizations key="orgs" label="Roles" />
                <Roles key="caps" label="Roles" />
                <UserRoles key="ucaps" label="User Roles" />
                <AddUser key="addu" label="Add User" />
                <AddOrganization key="createorg" label="Create Organization" />
                <CreateRole key="createcap" label="Create Role" />
                <CreateCapability key="createacc" label="Create Capability" />
                <GrantCapability key="grantacc" label="Grant Capability" />
                <GrantRole key="grant" label="Grant Role" />
                <RevokeRole key="revoke" label="Revoke Role" />
            </TabbedSections>
        </div>
    )
}
