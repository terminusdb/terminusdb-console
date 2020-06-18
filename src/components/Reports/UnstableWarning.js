import React from "react"
import { Alert, Container } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "../../constants/faicons"

export const UnstableWarning = ({feature}) => {
    return (
        <Alert color="warning">            
            <FontAwesomeIcon icon={icons.EXCLAMATION} className="mr-3"/>
            <span>
                <strong>Warning: {feature} is not yet stable</strong> This is an early release 
                of the <em>{feature}</em> feature which has been made available to allow the community to help us test
                 and improve the feature before full release.  Please treat with care until a 
                 stable release is announced. Help us out by letting us know of any bugs you find 
                 on our <a href="https://github.com/terminusdb/"> github pages</a>
            </span>            
        </Alert>
    )
}

