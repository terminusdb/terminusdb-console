import React, { useState, useEffect } from "react"
import { Alert, Container, Row, Col } from 'reactstrap'

//This needs to be extended!
export const ComponentFailure = ({error}) => {
    return (
        <Alert color="danger">
            Component Failure {JSON.stringify(error, false, 2)}
        </Alert>
    )
}