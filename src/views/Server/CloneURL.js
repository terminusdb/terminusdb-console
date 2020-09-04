import React from 'react'
import {CLONE_URL_FORM} from './constants.server'
import {TCForm} from '../../components/Form/FormComponents'

export const CloneURL = ({onClone}) => {
    let fields = CLONE_URL_FORM.fields

    function getURL(bits){
        onClone(bits.url)
    }
    let buttons = CLONE_URL_FORM.buttons

    return (
        <>
            <TCForm
                onSubmit={getURL}
                layout={[1]}
                noCowDucks
                fields={fields}
                buttons={buttons}
            />
        </>
    )
}
