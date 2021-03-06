import React, { useState, useCallback }from "react";
import { useForm } from 'react-hook-form';
import { collaborate, userList} from "../../variables/formLabels"
import { fakeUserData } from "../Test/fakeUserData"
import DataTable from 'react-data-table-component';
import { Col, Alert } from "react-bootstrap" //replaced;
import { RENDER_TYPE_TABLE }  from "../../labels/renderTypeLabels"
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"

const UserList = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [edit, setEditMode] = useState(false);
    const [chosenUser, setChosenUser] = useState();
    const [chosenUserId, setChosenUserId] = useState();
    const [updatedInfo, setUpdateUserInfo] = useState({});
    const [userCapabilityId, setUserCapabilityId] = useState();

    const dataResponse = {}
    const [loading, setLoading] = useState(false);

    let data =  [];
    let columns =  [];

    //console.log('data', data)

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
                               name={ READ.name }/>
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
