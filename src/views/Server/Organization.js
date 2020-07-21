import React from 'react'
import {ORGANIZATION_FORM} from './constants.server'
import {TCForm} from '../../components/Form/FormComponents'

export const Organization = ({onUpdate}) => {
    let fields = ORGANIZATION_FORM.fields


    let buttons = ORGANIZATION_FORM.buttons

    return (
        <>
            <TCForm
                onSubmit={onUpdate}
                layout={[2,2,1]}
                noCowDucks
                fields={fields}
                buttons={buttons}
            />
        </>
    )
}
