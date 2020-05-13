import React, { useState, useEffect } from "react"


export const SystemError = ({error}) => {
    return (
        <Container>
        {JSON.stringify(error, false, 2)}
        </Container>
    )
}