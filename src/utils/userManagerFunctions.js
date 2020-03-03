import { READ_ACCESS, WRITE_ACCESS, MANAGE_ACCESS } from "../labels/userAccessLabel"
import { READ, WRITE, MANAGE } from "../variables/databaseHomeLabels"


export const getAccessPermissions = (read, write, manage) => {
    let permissions = [];
    if(read) permissions.push(READ_ACCESS)
    if(write) permissions.push(WRITE_ACCESS)
    if(manage) permissions.push(MANAGE_ACCESS)
    return permissions;
}

export const getCapabilityID =  (read, write, manage) => {
    let capabilityID = '';
    capabilityID = capabilityID + READ.label // read is default
    if(write) capabilityID = capabilityID + '_' + WRITE.label
    if(manage) capabilityID = capabilityID + '_' + MANAGE.label
    return  capabilityID + '_Capability';
}
