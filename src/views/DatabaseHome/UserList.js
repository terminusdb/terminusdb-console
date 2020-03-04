import React, { useState, useCallback }from "react";
import { useForm } from 'react-hook-form';
import { collaborate, userList} from "../../variables/formLabels"
import { ClientHook } from '../../hooks/ClientHook'
import { UPDATE_USER_PERMISSIONS } from '../../labels/actionLabels'
import { fakeUserData } from "../../temp/fakeUserData"
import { QueryHook } from '../../hooks/QueryHook'
import DataTable from 'react-data-table-component';
import { Col, Alert } from "reactstrap";
import { RENDER_TYPE_TABLE }  from "../../labels/renderTypeLabels"
import { GET_USER_ACCESS_FOR_DB } from "../../labels/queryLabels"
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"

const UserList = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [edit, setEditMode] = useState(false);
    const [chosenUser, setChosenUser] = useState();
    const [chosenUserId, setChosenUserId] = useState();
    const [updatedInfo, setUpdateUserInfo] = useState({});
    const [userCapabilityId, setUserCapabilityId] = useState();

    const dataResponse = QueryHook(GET_USER_ACCESS_FOR_DB, RENDER_TYPE_TABLE);
    const [resp, loading] = ClientHook(UPDATE_USER_PERMISSIONS, updatedInfo)


    let data = dataResponse[0].columnData || [];
    let columns = dataResponse[0].columnConf || [];

    const handleChange = useCallback(state => {
        setEditMode(true);
        setChosenUser(state['v:Label'])
        setChosenUserId(state['v:UserID'])
        setUserCapabilityId(state['v:CapabilityID'])
    })

    const onSubmit = (data) => {
        let doc = {id: chosenUserId,
                   previousCapabilityId: userCapabilityId,
                   Read: data.Read,
                   Write: data.Write,
                   Manage: data.Manage}
        setUpdateUserInfo(doc)
    };


    return (
        <>
            <label className = { userList.label.className }
                htmlFor = { userList.label.name }>
                { userList.label.text }
            </label>

            <DataTable
                columns = {columns}
                data = {data}
                onRowClicked = {handleChange}
                pagination
                striped
                pointerOnHover
                highlightOnHover
                responsive/>

            {(!loading) && <Alert color="success">
               Successfully updated permissions of User - <b>{ chosenUser }</b>
             </Alert>}

           {edit && <>
               <hr className = "my-space-15"/>
               <hr className = "my-2"/>
               <hr className = "my-space-50"/>

               <label className = { userList.edit.className }
                 htmlFor = { userList.edit.name }>
                 { userList.edit.text + chosenUser}
               </label>

               <form onSubmit={ handleSubmit(onSubmit) }>
                    <span className="d-fl">
                        <Col md={1} className="mb-1">
                            <input type="checkbox"
                               ref = { register }
                               name={ READ.name }
                               defaultChecked/>
                       </Col>
                       <Col md={3} className="mb-3">
                           <label htmlFor = { READ.name }/>
                               { READ.label }
                       </Col>
                       <Col md={1} className="mb-1">
                           <input type="checkbox"
                              ref = { register }
                              name={ WRITE.name }/>
                       </Col>
                      <Col md={4} className="mb-4">
                          <label htmlFor = { WRITE.name }/>
                               { WRITE.label }
                      </Col>
                      <Col md={1} className="mb-1">
                          <input type="checkbox"
                             ref = { register }
                             name={ MANAGE.name }/>
                      </Col>
                     <Col md={4} className="mb-4">
                         <label htmlFor = { MANAGE.name }/>
                              { MANAGE.label }
                     </Col>
                  </span>

                  <button className = { userList.action.className }
                      type =  { userList.action.type } >
                      { userList.action.text }
                  </button>

              </form>

           </>}
        </>

    )
}

export default UserList;
