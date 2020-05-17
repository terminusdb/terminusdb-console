import React, {useState} from 'react'
import { handleSubmit, register, errors, useForm } from 'react-hook-form'
import { Container, Row, Col } from "reactstrap"
import { REQUIRED_FIELD, REQUIRED_FIELD_CSS, FORM_CONTAINER_CSS, FORM_SECTION_CSS, SECTION_TITLE_CSS,
         SUBMIT_SECTION_CSS, BUTTONS_CONTAINER_CSS, SUBMIT_CSS, CANCEL_CSS, CANCEL_TEXT, SUBMIT_TEXT, 
         LABEL_CSS, ERROR_MESSAGE_CSS, REQUIRED_FIELD_ERROR, FORM_FIELD_CSS, HELP_ROW_CSS, 
         PROMPT_ROW_CSS, INPUT_ROW_CSS, INPUT_GUTTER_CSS, ERROR_ROW_CSS, SELECT_CSS, INPUT_CSS, 
         TEXTAREA_CSS, CHECKBOX_CSS, CHECKBOX_WRAPPER_CSS, CHECKBOX_LABEL_CSS, HELP_CSS
        } from "./constants"
import Select from "react-select";
import { HelpCowDuck } from "../Reports/HelpCowDuck"
/**
* Library of Terminus Console (TC) form patterns
*/

export const TCForm = ({onSubmit, className, children}) => {
    const { handleSubmit } = useForm();
    className = className || FORM_CONTAINER_CSS
    return (
        <Container className={className}>
            <form onSubmit={handleSubmit(onSubmit) }>
                {children}   
            </form>     
        </Container>
    )
}

/*
export const TCDropdown = ({onSubmit, className, trigger, children, expanded, dropdownClassName}) => {
    const [isExpanded, setExpanded] = useState(expanded)
    
    let nutrigger = (
        <span onClick={() => }></span>
    )
    trigger.onClick = 
    dropdownClassName = dropdownClassName || BUTTONS_CONTAINER_CSS
    return (
        <TCForm onSubmit={onSubmit} className={className} >
            {!isExpanded && 
                <Container className={className}>
                    <Row>
                        <span className = {dropdownClassName}>
                            {trigger}
                        </span>
                    </Row>
                </Container>
            }
            {isExpanded && 
                {children}
            }
        </TCForm>
    )
}
*/

export const TCFormSection = ({title, className, titleClassName, children}) => {
    className = className || FORM_SECTION_CSS
    titleClassName = titleClassName || SECTION_TITLE_CSS
    return (
        <Container className={className}>
            {title &&
                <span className={titleClassName}>{title}</span>
            }
            {children}
        </Container>
    )
}

export const TCFormSubmits = ({className, buttonsClassName, onCancel, cancelText, cancelClassName, submitText, submitClassName}) => {
    className = className || SUBMIT_SECTION_CSS
    buttonsClassName = buttonsClassName || BUTTONS_CONTAINER_CSS
    submitClassName = submitClassName || SUBMIT_CSS
    cancelClassName = cancelClassName || CANCEL_CSS
    cancelText = cancelText || CANCEL_TEXT
    submitText = submitText || SUBMIT_TEXT    

    let myCancel = function(e){
        e.preventDefault()
        onCancel()
    }
    return (
        <Container className={className}>
            <Row>
                <span className = {buttonsClassName}>
                    {onCancel && 
                        <button type="cancel" onClick={myCancel} className={cancelClassName}>
                                {cancelText}
                        </button>
                    }
                    <button type="submit" className={submitClassName}>
                            {submitText}
                    </button>
                </span>
            </Row>
        </Container>
    )        
}

/**
 * Puts an input element into its position on the form by drawing all the stuff around it
 */

export const TCFormField = ({field_id, mandatory, className, label, labelClassName, 
    help, helpRowClassName, helpClassName, promptRowClassName, inputRowClassName, inputGutterClassName,
    cowDuckClassName, cowDuckIconClassName, errorRowClassName, error, fieldErrorClassName, children}) => {
    
    /** Set Field Level Defaults - defaults for elements are set within elements */
    className =  className || FORM_FIELD_CSS 
    helpRowClassName = helpRowClassName || HELP_ROW_CSS
    promptRowClassName = promptRowClassName || PROMPT_ROW_CSS
    inputRowClassName = inputRowClassName || INPUT_ROW_CSS
    inputGutterClassName = inputGutterClassName || INPUT_GUTTER_CSS
    errorRowClassName = errorRowClassName || ERROR_ROW_CSS
    cowDuckClassName = cowDuckClassName || COWDUCK_WRAPPER_CSS
    cowDuckIconClassName = cowDuckIconClassName || COWDUCK_ICON_CSS

    const flab = (        
        <TCFieldLabel
            field_id={field_id}
            label={label}
            mandatory = {mandatory}
            className= {labelClassName}
        />    
    )

    let cdhelp = ""
    if(help){
        help = (
            <TCFieldHelp 
                className={helpClassName} 
                message={help}
                field_id={field_id}                             
            />                        
        )
        cdhelp = (
            <HelpCowDuck 
                className={cowDuckClassName} 
                iconClassName = {cowDuckIconClassName}
                message={help}
                field_id={field_id} 
            />
        )
    }

    return (
        <Container className={className}>
            <Col>
                {help && 
                   <Row className={helpRowClassName}>
                        <Col md={6}>
                            {flab}
                        </Col>
                        <Col md={6}>
                            {help}
                        </Col>
                    </Row>
                }
                {!help && 
                    <Row className={promptRowClassName}>
                        {flab}
                    </Row>
                }
                <Row className={inputRowClassName}>
                    <Col>
                        {children}
                    </Col>
                    <Col md={{ size: 'auto'}} className={inputGutterClassName} >
                        {cdhelp}
                    </Col>
                </Row>
                <Row className={errorRowClassName}>
                    <TCFieldErrors 
                        className={fieldErrorClassName} 
                        error={error}
                        field_id={field_id}
                    />
                </Row>
            </Col>
        </Container>
    )
}

export const TCFieldHelp = ({field_id, message, className}) => {
    className = className || HELP_CSS
    return (
        <span className={className} id={field_id+"_help"}>
            {message} 
        </span>
    )
}


export const TCFieldLabel = ({field_id, label, mandatory, className, mandatoryClassName, mandatoryTitle}) => {
    className = className || LABEL_CSS
    return (
        <label className={className} htmlFor={field_id}>
            {label} 
            {mandatory && 
                <TCMandatory 
                    className={mandatoryClassName}
                    title={mandatoryTitle}
                />
            }                 
        </label>
    )
}

export const TCMandatory = (className, title) => {
    className = className || REQUIRED_FIELD_CSS 
    title = title || REQUIRED_FIELD
    return (
        <strong title={title} className={className}>
            *
        </strong>
    )
}

function TCFieldErrors(field_id, error, className){
    const { errors } = useForm();
    className = className || ERROR_MESSAGE_CSS 
    error = error || REQUIRED_FIELD_ERROR
    if(errors[field_id]){
        return (
            <p className = {className}>
                {error}
            </p>
        )
    }
    return null
}

export const TCFormInput = ({field_id, value, mandatory, validate, onChange, placeholder, className}) =>    {
    placeholder = placeholder || ""
    className = className || INPUT_CSS
    value = value || ""
    onChange = onChange || function(){}
    return (
        <input
            placeholder={ placeholder }
            className = {className }
            defaultValue={value}
            name = {field_id}
            onChange = {onChange}
            ref = { _makeStrRef(mandatory, validate) }
        />
    )
}

const _makeStrRef = (mandatory, validate) => {
    const { register } = useForm();
    let ref = register
    if(mandatory){
        ref = register({ validate: value => value.length > 0})
    }
    else if(validate){
        ref = register({ validate: value => validate(value)})
    }
    return ref
}

export const TCFormTextarea = ({field_id, value, mandatory, validate, onChange, placeholder, className}) =>    {
    placeholder = placeholder || ""
    className = className || TEXTAREA_CSS
    value = value || ""
    onChange = onChange || function(){}
    return (
        <textarea 
            name= { field_id }
            className = { className }
            placeholder = { placeholder }
            ref = { _makeStrRef(mandatory, validate) }
            onChange={onChange}
            defaultValue={value}
        />
    )
}

export const TCFormSelect = ({field_id, onChange, className, options, placeholder, value, mandatory, validate}) =>    {
    placeholder = placeholder || ""
    className = className || SELECT_CSS
    value = value || ""
    onChange = onChange || function(){}
    return(
        <Select 
            placeholder = {placeholder}
            className = {className}
            ref = { _makeStrRef(mandatory, validate) }
            onChange = {onChange}
            name = {field_id}
            options = {options}
            defaultValue = {value}
        />
    )        
}


export const TCFormCheckbox = ({field_id, onChange, className, label, checked, mandatory, wrapperClassName, labelClassName}) =>    {
    className = className || CHECKBOX_CSS
    checked = checked || false
    onChange = onChange || function(){}
    wrapperClassName = wrapperClassName || CHECKBOX_WRAPPER_CSS
    labelClassName = labelClassName || CHECKBOX_LABEL_CSS
    const { register } = useForm();
    let ref = register
    if(mandatory){
        ref = register({ validate: value => value})
    }
    return(
        <Row className={wrapperClassName} >
            <input type="checkbox"
                className = {className}
                defaultChecked ={checked}
                name = {field_id}
                id={field_id}
                ref = {ref}
            />
            <label className={labelClassName} htmlFor={field_id}>
                {label}
            </label>
        </Row>
    )        
}

