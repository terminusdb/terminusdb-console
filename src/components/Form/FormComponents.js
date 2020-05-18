import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { Container, Row, Col } from "reactstrap"
import { REQUIRED_FIELD, REQUIRED_FIELD_CSS, FORM_CONTAINER_CSS, FORM_SECTION_CSS, SECTION_TITLE_CSS,
         SUBMIT_SECTION_CSS, BUTTONS_CONTAINER_CSS, SUBMIT_CSS, CANCEL_CSS, CANCEL_TEXT, SUBMIT_TEXT, 
         LABEL_CSS, ERROR_MESSAGE_CSS, REQUIRED_FIELD_ERROR, FORM_FIELD_CSS, HELP_ROW_CSS, 
         PROMPT_ROW_CSS, INPUT_ROW_CSS, INPUT_GUTTER_CSS, ERROR_ROW_CSS, SELECT_CSS, INPUT_CSS, 
         TEXTAREA_CSS, CHECKBOX_CSS, CHECKBOX_WRAPPER_CSS, CHECKBOX_LABEL_CSS, HELP_CSS,
         COWDUCK_WRAPPER_CSS, COWDUCK_ICON_CSS, INTERNAL_ROW_CSS, INTERNAL_COL_CSS, INPUT_COL_CSS,
         HELP_LABEL_COL_CSS, HELP_COL_CSS, INVISIBLE_HELP_CSS
        } from "./constants"
import Select from "react-select";
import { HelpCowDuck } from "../Reports/HelpCowDuck"
import { isObject } from '../../utils/helperFunctions';

/**
* Library of Terminus Console (TC) form patterns
*/

export const TCForm = ({onSubmit, className, children}) => {
    const { handleSubmit } = useForm();
    if(!className || isObject(className)) className = FORM_CONTAINER_CSS
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
    if(!className || isObject(className)) className = FORM_SECTION_CSS
    if(!titleClassName || isObject(titleClassName))  titleClassName = SECTION_TITLE_CSS
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
    if(!className || isObject(className)) className = SUBMIT_SECTION_CSS
    if(!buttonsClassName || isObject(buttonsClassName)) buttonsClassName = BUTTONS_CONTAINER_CSS
    if(!submitClassName || isObject(submitClassName) )submitClassName = SUBMIT_CSS
    if(!cancelClassName || isObject(cancelClassName) )cancelClassName = CANCEL_CSS
    if(!cancelText || isObject(cancelText) ) cancelText = CANCEL_TEXT
    if(!submitText|| isObject(submitText) ) submitText = SUBMIT_TEXT    

    let myCancel = function(e){
        e.preventDefault()
        onCancel()
    }
    return (
        <Row className={className}>
            <span className = {buttonsClassName}>
                <button type="submit" className={submitClassName}>
                    {submitText}
                </button>
                {onCancel && 
                    <button onClick={myCancel} className={cancelClassName}>
                            {cancelText}
                    </button>
                }
            </span>
        </Row>
    )        
}

export const TCSubmitWrap = ({className, buttonsClassName, children}) => {
    if(!className || isObject(className)) className = SUBMIT_SECTION_CSS
    if(!buttonsClassName || isObject(buttonsClassName)) buttonsClassName = BUTTONS_CONTAINER_CSS
    return (
        <Row className={className}>
            <span className = {buttonsClassName}>
               {children}
            </span>
        </Row>
    )
} 

/**
 * Puts an input element into its position on the form by drawing all the stuff around it
 */

export const TCFormField = ({field_id, mandatory, className, label, labelClassName, 
    help, helpExpanded, helpRowClassName, helpClassName, helpLabelColClassName, helpColClassName, helpCols, promptRowClassName, inputRowClassName, inputGutterClassName,
    cowDuckClassName, cowDuckIconClassName, errorRowClassName, error, fieldErrorClassName, children}) => {
    
    /** Set Field Level Defaults - defaults for elements are set within elements */
    if(!className || isObject(className)) className = FORM_FIELD_CSS 
    if(!helpRowClassName || isObject(helpRowClassName)) helpRowClassName = HELP_ROW_CSS
    if(!promptRowClassName || isObject( promptRowClassName)) promptRowClassName = PROMPT_ROW_CSS
    if(!inputRowClassName  || isObject(inputRowClassName )) inputRowClassName = INPUT_ROW_CSS
    if(!inputGutterClassName || isObject(inputGutterClassName )) inputGutterClassName = INPUT_GUTTER_CSS
    if(!errorRowClassName || isObject(errorRowClassName)) errorRowClassName = ERROR_ROW_CSS
    if(!cowDuckClassName || isObject(cowDuckClassName)) cowDuckClassName = COWDUCK_WRAPPER_CSS
    if(!cowDuckIconClassName || isObject(cowDuckIconClassName)) cowDuckIconClassName = COWDUCK_ICON_CSS
    if(!helpLabelColClassName|| isObject(helpLabelColClassName)) helpLabelColClassName = HELP_LABEL_COL_CSS 
    if(!helpColClassName || isObject(helpColClassName)) helpColClassName = HELP_COL_CSS
    
    helpExpanded = helpExpanded || false 
    const [helpVisible, setHelpVisible] = useState(helpExpanded)
    function toggleHelp(){
        setHelpVisible(!helpVisible)
    }

    helpCols = helpCols || 6
    let helpLabelCols = (12 - helpCols)

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
                visible={helpVisible}
                field_id={field_id}                             
            />                        
        )
        cdhelp = (
            <HelpCowDuck 
                className={cowDuckClassName} 
                iconClassName = {cowDuckIconClassName}
                message={help}
                visible={helpVisible}
                onClick={toggleHelp}
                field_id={field_id} 
            />
        )
    }

    return (
        <Container className={className}>
            <Col>
                {help && 
                   <Row className={helpRowClassName}>
                        <Col className={helpLabelColClassName} md={helpLabelCols}>
                            {flab}
                        </Col>
                        <Col className={helpColClassName} md={helpCols}>
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
                    <Col className={INPUT_COL_CSS}>
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

export const TCFieldHelp = ({field_id, message, className, invisibleHelpClassName, visible}) => {
    if(!className || isObject(className)) className = HELP_CSS
    if(!invisibleHelpClassName || isObject(invisibleHelpClassName)) invisibleHelpClassName = INVISIBLE_HELP_CSS
    let vis = (visible ? className : invisibleHelpClassName)
    return (
        <span className={vis} id={field_id+"_help"}>
            {message} 
        </span>
    )
}


export const TCFieldLabel = ({field_id, label, mandatory, className, mandatoryClassName, mandatoryTitle}) => {
    if(!className || isObject(className)) className = LABEL_CSS
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

export const TCMandatory = ({className, title}) => {
    if(!className || isObject(className)) className = REQUIRED_FIELD_CSS 
    if(!title || isObject(title)) title = REQUIRED_FIELD
    return (
        <strong title={title} className={className}> * </strong>
    )
}

function TCFieldErrors({field_id, error, className}){
    if(!className || isObject(className)) className = ERROR_MESSAGE_CSS 
    if(error && error[field_id]){
        error = error[field_id] 
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
    if(!className || isObject(className)) className = INPUT_CSS
    value = value || ""
    const { register } = useForm();
    let vchange = _onChange(onChange, field_id)
    return (
        <input
            placeholder={ placeholder }
            className = {className }
            defaultValue={value}
            onChange={vchange}
            name = {field_id}
            ref = { register }
        />
    )
}

const _onChange = (ch, field_id) => {
    if(ch){
        let vchange = function(val){
            ch(field_id, val.target.value)
        }
        return vchange
    }
    return false
}

const _onSChange = (ch, field_id) => {
    if(ch){
        let vchange = function(SelValue){
            ch(field_id, SelValue.value)
        }
        return vchange
    }
    return false
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
    if(!className || isObject(className)) className = TEXTAREA_CSS
    value = value || ""
    let vchange = _onChange(onChange, field_id)
    return (
        <textarea 
            name= { field_id }
            className = { className }
            placeholder = { placeholder }
            ref = { _makeStrRef(mandatory, validate) }
            onChange ={vchange}
            defaultValue={value}
        />
    )
}

export const TCFormSelect = ({field_id, onChange, className, options, placeholder, value, mandatory, validate}) =>    {
    placeholder = placeholder || ""
    if(!className || isObject(className)) className = SELECT_CSS
    value = value || ""
    let vchange = _onSChange(onChange, field_id)
    return(
        <Select 
            placeholder = {placeholder}
            className = {className}
            onChange ={vchange}
            ref = { _makeStrRef(mandatory, validate) }
            name = {field_id}
            options = {options}
            defaultValue = {value}
        />
    )        
}


export const TCFormCheckbox = ({field_id, onChange, className, label, checked, mandatory, wrapperClassName, labelClassName}) =>    {
    if(!className || isObject(className)) className = CHECKBOX_CSS
    checked = checked || false
    onChange = onChange || function(){}
    wrapperClassName = wrapperClassName || CHECKBOX_WRAPPER_CSS
    labelClassName = labelClassName || CHECKBOX_LABEL_CSS
    const { register } = useForm();
    let ref = register
    if(mandatory){
        ref = register({ validate: value => value})
    }
    let vchange = _onChange(onChange, field_id)

    return(
        <Row className={wrapperClassName} >
            <input type="checkbox"
                className = {className}
                onChange = {vchange}
                defaultChecked ={checked}
                name = {field_id}
                id={field_id}
                ref = {register}
            />
            <label className={labelClassName} htmlFor={field_id}>
                {label}
            </label>
        </Row>
    )        
}

export const TCRow = ({className, children}) => {
    if(!className || isObject(className)) className = INTERNAL_ROW_CSS
    return (
        <Row className={className}>
            {children}
        </Row>
    )
}

export const TCCol = ({className, children}) => {
    if(!className || isObject(className)) className = INTERNAL_COL_CSS
    return (
        <Col className={className}>
            {children}
        </Col>
    )
}

 
