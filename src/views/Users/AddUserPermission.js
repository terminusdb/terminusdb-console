import React, {useState}from "react";
import AddUserPermissionForm from "./AddUserPermissionForm"

const AddUserPermission = (props) => {
    const [userInfo, setCreateUserInfo] =  useState({});
    let selectedUsers = [];

    for (const [index, value] of props.selected.entries()) {
        selectedUsers.push(<AddUserPermissionForm id = {value.value} name = {value.label}/>)
    }

    return (
       <>
           <hr className = "my-space-50"/>
           {selectedUsers}
      </>
    )
}

export default AddUserPermission;
