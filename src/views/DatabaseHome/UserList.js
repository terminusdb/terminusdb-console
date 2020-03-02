import React, {useState}from "react";
import { useForm } from 'react-hook-form';
import { CREATE_NEW_USER } from "../../labels/actionLabels"
import { collaborate, userList} from "../../variables/formLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels";
import { ClientHook } from '../../hooks/ClientHook'
import { fakeUserData } from "../../temp/fakeUserData"
import DataTable from 'react-data-table-component';
import { Col } from "reactstrap";
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"

const UserList = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const [edit, setEditMode] = useState(true);
    const dbStats = READ.label;

    const handleChange = () => {
        setEditMode(edit);
        //add logic to set permissions on row data')
    }

    return (
        <>
            <label className = { userList.label.className }
              htmlFor = { userList.label.name }>
              { userList.label.text }
            </label>
            <DataTable  columns={fakeUserData.columnConf}
                data={fakeUserData.columnData}
                striped
                pointerOnHover
                onRowClicked = {handleChange}
                highlightOnHover
                pagination/>

           {edit && <>
               <hr className = "my-space-15"/>
               <hr className = "my-2"/>
               <hr className = "my-space-50"/>

               <span className="d-fl">
                    <Col md={1} className="mb-1">
                        <input type="radio"
                           name={ READ.name }
                           checked={dbStats === READ.label}/>
                   </Col>
                   <Col md={3} className="mb-3">
                       <label htmlFor = { READ.name }/>
                           { READ.label }
                   </Col>
                   <Col md={1} className="mb-1">
                       <input type="radio"
                          checked={dbStats === WRITE.label}
                          name={ WRITE.name }/>
                   </Col>
                  <Col md={4} className="mb-4">
                      <label htmlFor = { WRITE.name }/>
                           { WRITE.label }
                  </Col>
                  <Col md={1} className="mb-1">
                      <input type="radio"
                         checked={dbStats === MANAGE.label}
                         name={ MANAGE.name }/>
                  </Col>
                 <Col md={4} className="mb-4">
                     <label htmlFor = { MANAGE.name }/>
                          { MANAGE.label }
                 </Col>
              </span>
           </>}

           <button className = { userList.label.className }
               type =  { userList.action.type } >
               { userList.action.text }
           </button>

        </>

    )
}

export default UserList;
