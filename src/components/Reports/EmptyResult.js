import React, { useState, useEffect } from "react"
import { Alert } from 'reactstrap'


export const EmptyResult = (props) => {
    return <Alert color="warning">No Records Found</Alert>
}