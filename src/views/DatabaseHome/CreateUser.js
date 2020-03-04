import React, {useState}from "react";
import { useForm } from 'react-hook-form';
import { Alert } from 'reactstrap';
import { CREATE_NEW_USER } from "../../labels/actionLabels"
import { collaborate, createUser } from "../../variables/formLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels";
import { ClientHook } from '../../hooks/ClientHook'
import { Col } from "reactstrap";
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"

const CreateNewUser = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [userInfo, setCreateUserInfo] =  useState({})

    const [dataResponse, loading] = ClientHook(CREATE_NEW_USER, userInfo);

    const onSubmit = (data) => {
        let doc = {id: data.userID,
                   title: data.userName,
                   description:data.userDescription,
                   email: data.userEmail,
                   key: data.userKey,
                   Read: data.Read,
                   Write: data.Write,
                   Manage: data.Manage}
        setCreateUserInfo(doc)
    };


    return (
             <>{(!loading) && <Alert color="success">
                Successfully created new User - <b>{userInfo.id}</b>
              </Alert>}
             <form onSubmit={ handleSubmit(onSubmit) }>
                 <label htmlFor = { createUser.id.label.htmlFor }>
            		{ createUser.id.label.text }
                </label>
            	<input placeholder={ createUser.id.input.placeholder }
                    className = { createUser.id.input.className }
            		name = { createUser.id.input.name }
            		ref = { register({ validate: value => value.length > 0}) }/>

            		   { errors.userID &&
            			   <p className = { createUser.id.error.className }>
            			   { createUser.id.error.text }</p>}

               <label className = { createUser.userName.label.className }
                  htmlFor = { createUser.userName.label.htmlFor }>
                  { createUser.userName.label.text }
              </label>
              <input placeholder={ createUser.userName.input.placeholder }
                  className = { createUser.userName.input.className }
                  name = { createUser.userName.input.name }
                  ref = { register({ validate: value => value.length > 0}) }/>

                     { errors.userName &&
                         <p className = { createUser.userName.error.className }>
                         { createUser.userName.error.text }</p>}

             <label className = { createUser.userEmail.label.className }
                htmlFor = { createUser.userEmail.label.htmlFor }>
                { createUser.userEmail.label.text }
            </label>
            <input placeholder={ createUser.userEmail.input.placeholder }
                className = { createUser.userEmail.input.className }
                name = { createUser.userEmail.input.name }
                ref = { register }/>

             <label className = { createUser.userDescription.label.className }
                htmlFor = { createUser.userDescription.label.htmlFor }>
                { createUser.userDescription.label.text }
            </label>
            <input placeholder={ createUser.userDescription.input.placeholder }
                className = { createUser.userDescription.input.className }
                name = { createUser.userDescription.input.name }
                ref = { register }/>

            <hr className = "my-space-50"/>
            <span className="d-fl">
                 <Col md={1} className="mb-1">
                     <input type="checkbox"
                        name={ READ.name }
                        ref = { register }/>
                </Col>
                <Col md={3} className="mb-3">
                    <label htmlFor = { READ.name }/>
                        { READ.label }
                </Col>
                <Col md={1} className="mb-1">
                    <input type="checkbox"
                       name={ WRITE.name }
                       ref = { register }/>
                </Col>
               <Col md={4} className="mb-4">
                   <label htmlFor = { WRITE.name }/>
                        { WRITE.label }
               </Col>
               <Col md={1} className="mb-1">
                   <input type="checkbox"
                      name={ MANAGE.name }
                      ref = { register }/>
               </Col>
              <Col md={4} className="mb-4">
                  <label htmlFor = { MANAGE.name }/>
                       { MANAGE.label }
              </Col>
           </span>

          <button className = { createUser.action.className }
              type =  { createUser.action.type } >
              { createUser.action.text }
          </button>

      </form> </>
    )
}

export default CreateNewUser;
