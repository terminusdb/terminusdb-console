import React, {useState}from "react";
import { addUser } from "../../variables/formLabels"
import { Col } from "react-bootstrap" //replaced;
import { READ, WRITE, MANAGE } from "../../variables/databaseHomeLabels"
import Select from "react-select";
import { GET_BINDINGS }  from "../../labels/renderTypeLabels"
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


    const dataResponse = {};
    //const opts = dataResponse[0].result;
    const opts = []

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
          {(Array.isArray(chosen)) && (chosen.length > 0) && <AddUserPermission selected = { chosen }/>}
      </>
    )
}

export default AddUsers;
