import React from "react";
import { FormGroup, ControlLabel, FormControl, Row } from "react-bootstrap";

function FieldGroup({ label, ...props }) {
  return (
    <FormGroup>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
    </FormGroup>
  );
}

export const FormInputs = (props) => {
    var row = [];
    for (var i = 0; i < props.ncols.length; i++) {
      row.push(
        <div key={i} className={props.ncols[i]}>
          <FieldGroup {...props.properties[i]} />
        </div>
      );
    }
    return <Row>{row}</Row>;
}
