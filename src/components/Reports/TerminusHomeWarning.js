import React from 'react'
import {Container} from "react-bootstrap" //replace
import {WOQLClientObj} from '../../init/woql-client-instance'
import {MASCOT_COLOR} from '../../constants/images'
import {WARNING_PAGE_CSS, WARNING_BOX_CSS} from './constants.reports'

export const TerminusHomeWarning = ({heading, body}) => {
    const {setKey} = WOQLClientObj()

    const setKeyUpdate = (evt) => {
        evt.preventDefault()
        setKey(undefined)
    }

    return (
        <Container fluid className={WARNING_PAGE_CSS}>
            <div className={WARNING_BOX_CSS}>
                <img src={MASCOT_COLOR} alt="" width="70%" height="auto"></img>
                <h2 className="mb-4">{heading}</h2>
                <p className="mb-4">{body}</p>
            </div>
        </Container>
    )
}
