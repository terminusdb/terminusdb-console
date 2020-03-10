import React, {useState}from "react";
import { useForm } from 'react-hook-form';
import { Alert } from 'reactstrap';
import { ADD_USER } from "../../labels/actionLabels"
import { addUser } from "../../variables/formLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels";
import { QueryHook } from '../../hooks/QueryHook'
import { Col } from "reactstrap";
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"
import Select from "react-select";
import { GET_BINDINGS }  from "../../labels/renderTypeLabels"
import { AddIcon } from "../../components/LoadFontAwesome"
import { USER_PLUS } from '../../labels/iconLabels'
import { UserManHook } from '../../hooks/UserManHook'
import { stripDocFromUrl } from '../../utils/extractStrings'

const AddUserPermissionForm = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [userInfo, setCreateUserInfo] =  useState({});
    let selectedUsers = [];
    const [dataResponse, loading] = UserManHook(ADD_USER, userInfo);


    const onSubmit = (data) => {
        let doc = {id: props.id,
                   Read: data.Read,
                   Write: data.Write,
                   Manage: data.Manage}
        setCreateUserInfo(doc)
    }

    return (
        <>
        <hr className="my-space-50"/>
        {(!loading) && <Alert color="success">
           Successfully added new User - <b>{stripDocFromUrl(userInfo.id)}</b>
         </Alert>}
        <form onSubmit={ handleSubmit(onSubmit) }>
            <label> {props.name} </label>
            <span className="d-fl">
                 <Col md={1} className="mb-1">
                     <input type="checkbox"
                        name={ READ.name }
                        ref = { register }/>
                </Col>
                <Col md={2} className="mb-2">
                    <label htmlFor = { READ.name }/>
                        { READ.label }
                </Col>
                <Col md={1} className="mb-1">
                    <input type="checkbox"
                       name={ WRITE.name }
                       ref = { register }/>
                </Col>
               <Col md={2} className="mb-2">
                   <label htmlFor = { WRITE.name }/>
                        { WRITE.label }
               </Col>
               <Col md={1} className="mb-1">
                   <input type="checkbox"
                      name={ MANAGE.name }
                      ref = { register }/>
               </Col>
              <Col md={2} className="mb-2">
                  <label htmlFor = { MANAGE.name }/>
                       { MANAGE.label }
              </Col>
              {/*<Col md={3} className="mb-3">
                  <button className = { addUser.action.className }
                      type =  { addUser.action.type } >
                      <AddIcon icon= {USER_PLUS} className = {'ic-a-us'}/>
                  </button>
              </Col>*/}
              <Col md={3} className="mb-3">
                  <button className = { addUser.action.className }
                      type =  { addUser.action.type } > Add User
                  </button>
              </Col>

           </span>


        </form>

        <hr className="my-space-15"/>
        <hr className="my-2"/>
        <hr className="my-space-15"/>
        </>
    )
}

export default AddUserPermissionForm;
