import React from 'react';
import { FormGroup, Label,Input, FormText} from "react-bootstrap" //replaced;

export const FormGroups = (props) => {
    const select = props.select || false;
    const input = props.input || false;
    const users = ['jose', 'who']; //junk data

    return (
        <FormGroup check className="mb-3 mt-3">
          <Label check>
            <FormText color="muted">
                {props.description}
            </FormText>
            {select && <Input type={props.type} name={props.name}>
                <option>{users[0]}</option>
                <option>{users[1]}</option>
             </Input>}
            {input && <Input type={props.type} name={props.name}/>}
            {props.label}
          </Label>
        </FormGroup>
    )
}
