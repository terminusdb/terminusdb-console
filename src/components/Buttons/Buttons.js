import React from "react";
import { Button } from "react-bootstrap";

export const CustomButton = (props) => {
    return <Button className={props.btnClasses} {...props.buttonName} />;
}
