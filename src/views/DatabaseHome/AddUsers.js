import React, {useState}from "react";
import { CREATE_NEW_USER } from "../../labels/actionLabels"
import { addUser } from "../../variables/formLabels"
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels";
import { QueryHook } from '../../hooks/QueryHook'
import { Col } from "reactstrap";
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"
import Select from "react-select";
import { GET_BINDINGS }  from "../../labels/renderTypeLabels"
import { GET_USER_LIST } from "../../labels/queryLabels"
import AddUserPermission from './AddUserPermission'

const AddUsers = (props) => {
    const [userInfo, setCreateUserInfo] =  useState({});
    const [isSelected, setSelected] = useState(false);
    const [values, setReactSelect] = useState({
      selectedOption: [{}]
    });
    const [chosen, setChosenList] = useState([]);

    const handleSelect = (ev) => {
        setChosenList(ev)
        setSelected(true);
    }


    const dataResponse = QueryHook(GET_USER_LIST, GET_BINDINGS)
    const opts = dataResponse[0].result;

    return (
       <>
           <hr className = "my-space-50"/>
           <label htmlFor = { addUser.label.htmlFor }>
              { addUser.label.text }
          </label>
          <Select placeholder = { "User Name" }
               isMulti
               value = {values.selectedOption.value}
               onChange={ handleSelect }
               options = {opts}/>
          {(chosen.length > 0) && <AddUserPermission selected = { chosen }/>}
      </>
    )
}

export default AddUsers;
