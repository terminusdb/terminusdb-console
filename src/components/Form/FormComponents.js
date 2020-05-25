import React, {useState, useEffect} from 'react'
import { Container, Row, Col } from "reactstrap"
import { REQUIRED_FIELD, REQUIRED_FIELD_CSS, SUBMIT_SECTION_CSS, BUTTONS_CONTAINER_CSS,
         SUBMIT_CSS, CANCEL_CSS, CANCEL_TEXT, SUBMIT_TEXT, ILLEGAL_ID_ERROR,
         LABEL_CSS, ERROR_MESSAGE_CSS, REQUIRED_FIELD_ERROR, FORM_FIELD_CSS, HELP_ROW_CSS,
         PROMPT_ROW_CSS, INPUT_ROW_CSS, INPUT_GUTTER_CSS, ERROR_ROW_CSS, SELECT_CSS, INPUT_CSS,
         TEXTAREA_CSS, CHECKBOX_CSS, CHECKBOX_WRAPPER_CSS, CHECKBOX_LABEL_CSS, HELP_CSS,
         DEPLOY_COWDUCKS, COWDUCK_WRAPPER_CSS, COWDUCK_ICON_CSS, INTERNAL_ROW_CSS, INTERNAL_COL_CSS, INPUT_COL_CSS,
         HELP_LABEL_COL_CSS, HELP_COL_CSS, INVISIBLE_HELP_CSS, CHECKED_WRAPPER_CSS
        } from "./constants"
import Select from "react-select";
import { HelpCowDuck } from "../Reports/HelpCowDuck"
import { isObject } from '../../utils/helperFunctions';
import {APIUpdateReport} from '../Reports/APIUpdateReport'

export const TCForm = ({onSubmit, onChange, report, fields, buttons, layout, validate, values, errors, children}) => {

    //these are the things that this component changes internally -
    //if they change in props, assume whole component will be re-rendered by parent.. need no effect
    const [currentValues, setCurrentValues] = useState(values || {})
    const [fieldErrors, setFieldErrors] = useState(errors || {})

    useEffect(() => {
        if(values) setCurrentValues(values)
        if(errors) setFieldErrors(errors)
    }, [values, errors])

    function findMissingMandatories(){
        if(!fields) return 0;
        let missings = {}
        for(var i = 0 ; i<fields.length; i++){
            let item = fields[i]
            if(item.id && !currentValues[item.id] && item.mandatory){
                missings[item.id] = REQUIRED_FIELD_ERROR
            }
        }
        setFieldErrors(missings)
        return Object.keys(missings).length
    }

    function findIllegalIDs(){
        if(!fields) return 0;
        let bads = {}
        for(var i = 0 ; i<fields.length; i++){
            let item = fields[i]
            if(item.id && item.terminusID){
                let xval = currentValues[item.id]
                if(typeof xval == "string" && (xval.indexOf(" ") != -1 || xval.indexOf(":") != -1 || xval.indexOf("/") != -1)){
                    bads[item.id] = ILLEGAL_ID_ERROR
                }
            }
        }
        setFieldErrors(bads)
        return Object.keys(bads).length
    }


    function interceptSubmit(e){
        e.preventDefault()
        if(findMissingMandatories() == 0 && findIllegalIDs() == 0 && (!validate || validate(currentValues, fields) == 0)){
            onSubmit(currentValues)
        }
    }

    function onChangeField(field_id, value){
        currentValues[field_id] = value
        if(onChange) onChange(field_id, value, currentValues)
        setCurrentValues(currentValues)
        if(fieldErrors[field_id]){
            delete(fieldErrors[field_id])
            setFieldErrors(fieldErrors)
        }
    }

    let tcf = JSONTCFields(fields, currentValues, fieldErrors, onChangeField)

    let showGrid = (layout && tcf)
    let noGrid = (!layout && tcf)
    return (
        <form onSubmit={interceptSubmit} errors={fieldErrors} values={currentValues} className={'tcf-form'}>
            {(report && isObject(report)) &&
                <TCRow>
                    <APIUpdateReport error = { report.error } message={report.message} status={report.status} time={report.time}/>
                </TCRow>
            }
            <JSONTCButtons buttons={buttons} />
            {showGrid &&
                <TCGrid layout={layout}>
                    {tcf}
                </TCGrid>
            }
            {noGrid && <>
                {tcf}
            </>}
            {children}
        </form>
    )
}

export const TCFormSubmits = ({className, buttonsClassName, onCancel, cancelText, cancelClassName, submitText, submitClassName}) => {
    if(typeof className != "string" || !className) className = SUBMIT_SECTION_CSS
    if(!buttonsClassName || typeof buttonsClassName != "string") buttonsClassName = BUTTONS_CONTAINER_CSS
    if(!submitClassName || typeof submitClassName != "string") submitClassName = SUBMIT_CSS
    if(!cancelClassName || typeof cancelClassName != "string" )cancelClassName = CANCEL_CSS
    if(!cancelText || typeof cancelClassName != "string") cancelText = CANCEL_TEXT
    if(!submitText || typeof cancelClassName != "string") submitText = SUBMIT_TEXT

    let myCancel = function(e){
        e.preventDefault()
        onCancel()
    }

    return (
        <TCSubmitWrap buttonsClassName={buttonsClassName} className={className}>
            <button type="submit" className={submitClassName}>
                {submitText}
            </button>
            {onCancel &&
                <button onClick={myCancel} className={cancelClassName}>
                    {cancelText}
                </button>
            }
        </TCSubmitWrap>
    )
}

export const TCSubmitWrap = ({className, buttonsClassName, children}) => {
    if(typeof className != "string" || !className) className = SUBMIT_SECTION_CSS
    if(!buttonsClassName || typeof buttonsClassName != "string") buttonsClassName = BUTTONS_CONTAINER_CSS
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

export const TCFormField = ({
        field_id, value, inputElement, mandatory, className, label, labelClassName, onChangeField,
        help, helpExpanded, helpRowClassName, helpClassName, helpLabelColClassName, helpColClassName, helpCols,
        promptRowClassName, inputRowClassName, inputGutterClassName, cowDuck, cowDuckClassName, cowDuckIconClassName,
        errorRowClassName, error, fieldErrorClassName, children
    }) => {

    if(typeof cowDuck != "string" ) cowDuck = DEPLOY_COWDUCKS

    /** Set Field Level Defaults - defaults for elements are set within elements */
    if(typeof className != "string" || !className) className = FORM_FIELD_CSS
    if(!helpRowClassName || typeof helpRowClassName != "string") helpRowClassName = HELP_ROW_CSS
    if(!promptRowClassName || typeof  promptRowClassName != "string") promptRowClassName = PROMPT_ROW_CSS
    if(!inputRowClassName  || typeof inputRowClassName  != "string") inputRowClassName = INPUT_ROW_CSS
    if(!inputGutterClassName || typeof inputGutterClassName != "string") inputGutterClassName = INPUT_GUTTER_CSS
    if(!errorRowClassName || typeof errorRowClassName != "string") errorRowClassName = ERROR_ROW_CSS
    if(!cowDuckClassName || typeof cowDuckClassName != "string") cowDuckClassName = COWDUCK_WRAPPER_CSS
    if(!cowDuckIconClassName || typeof cowDuckIconClassName != "string") cowDuckIconClassName = COWDUCK_ICON_CSS
    if(!helpLabelColClassName|| typeof helpLabelColClassName != "string") helpLabelColClassName = HELP_LABEL_COL_CSS
    if(!helpColClassName || typeof helpColClassName != "string") helpColClassName = HELP_COL_CSS

    helpExpanded = ((helpExpanded && !isObject(helpExpanded)) ? helpExpanded  : false)

    const [helpVisible, setHelpVisible] = useState(helpExpanded)
    //const [currentValue, setValue] = useState(value)
    //const [currentError, setError] = useState(error)

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

    let fcontents = (inputElement ? JSONTCInputElement(field_id, value, mandatory, onChangeField, inputElement) : "")

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
                    {fcontents}
                    {children}
                    </Col>
                    {cowDuck &&
                        <Col md={{ size: 'auto'}} className={inputGutterClassName} >
                            {cdhelp}
                        </Col>
                    }
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
    if(typeof className != "string" || !className)  className = HELP_CSS
    if(!invisibleHelpClassName || isObject(invisibleHelpClassName)) invisibleHelpClassName = INVISIBLE_HELP_CSS
    let vis = (visible ? className : invisibleHelpClassName)
    return (
        <span className={vis} id={field_id+"_help"}>
            {message}
        </span>
    )
}


export const TCFieldLabel = ({field_id, label, mandatory, className, mandatoryClassName, mandatoryTitle}) => {
    if(typeof className != "string" || !className) className = LABEL_CSS
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
    if(typeof className != "string" || !className) className = REQUIRED_FIELD_CSS
    if(!title || isObject(title)) title = REQUIRED_FIELD
    return (
        <strong title={title} className={className}> * </strong>
    )
}

function TCFieldErrors({field_id, error, className}){
    if(typeof error != "string" ||!error) return null
    if(typeof className != "string" || !className)  className = ERROR_MESSAGE_CSS
    return (
        <p className = {className}>
            {error}
        </p>
    )
}

export const TCFormInput = ({field_id, value, disabled, onChange, placeholder, className}) =>    {
    placeholder = placeholder || ""
    if(typeof className != "string" || !className)  className = INPUT_CSS
    const [val, setVal] = useState(value || "")
    useEffect(() => {setVal(value)}, [value])
    let vchange = function(val){
        setVal(val.target.value)
        onChange(field_id, val.target.value)
    }
    return (
        <input
            disabled={disabled}
            placeholder={ placeholder }
            className = { className }
            value={val}
            onChange={vchange}
            name = {field_id}
        />
    )
}


export const TCFormTextarea = ({field_id, value, disabled, onChange, placeholder, className}) =>    {
    placeholder = (placeholder && !isObject(placeholder) ? placeholder  : "")
    if(typeof className != "string" || !className)  className = TEXTAREA_CSS
    const [val, setVal] = useState(value || "")
    useEffect(() => {setVal(value)}, [value])
    let vchange = function(val){
        setVal(val.target.value)
        onChange(field_id, val.target.value)
    }
    return (
        <textarea
            name= { field_id }
            disabled={disabled}
            className = { className }
            placeholder = { placeholder }
            onChange ={vchange}
            value={val}
        />
    )
}
export const TCFormSelect = ({field_id, onChange, className, options, placeholder, value, disabled}) =>    {
    placeholder = placeholder || ""
    if(typeof className != "string" || !className) className = SELECT_CSS
    value = value || ""
    if(disabled){
        options = options.map((item) => {
            item["isDisabled"] = true;
            return item;
        })
    }
    const [val, setVal] = useState(value || "")
    useEffect(() => {setVal(value)}, [value])
    let vchange = function(selval){
        setVal(selval.value)
        onChange(field_id, selval.value)
    }

    return(
        <Select
            placeholder = {placeholder}
            className = {className}
            onChange ={vchange}
            name = {field_id}
            options = {options}
            defaultValue= {val}
        />
    )
}

export const TCFormCheckbox = ({field_id, onChange, className, label, checked, disabled, wrapperClassName, labelClassName}) =>    {
    const [val, setVal] = useState(checked || false)
    useEffect(() => {setVal(checked)}, [checked])
    let vchange = function(val){
        setVal(val.target.checked)
        onChange(field_id, val.target.checked)
        changeWrapper()
    }

    if(typeof className != "string" || !className)  className = CHECKBOX_CSS
    const [wcss, setWcss] = useState(checked ? CHECKED_WRAPPER_CSS : CHECKBOX_WRAPPER_CSS)

    function changeWrapper(){
        setWcss((wcss == CHECKBOX_WRAPPER_CSS) ? CHECKED_WRAPPER_CSS : CHECKBOX_WRAPPER_CSS)
    }

    if(typeof labelClassName != "string" || !labelClassName) labelClassName = CHECKBOX_LABEL_CSS

    return(
        <span className={wcss}>
            <input type="checkbox"
                disabled = {disabled}
                className = {className}
                onChange = {vchange}
                checked ={val}
                name = {field_id}
                id={field_id}
            />
            <label className={labelClassName} htmlFor={field_id}>
                {label}
            </label>
        </span>
    )
}

export const TCRow = ({className, children}) => {
    if(typeof className != "string" || !className)  className = INTERNAL_ROW_CSS
    return (
        <Row className={className}>
            {children}
        </Row>
    )
}

export const TCCol = ({className, children}) => {
    if(typeof className != "string" || !className) className = INTERNAL_COL_CSS
    return (
        <Col className={className}>
            {children}
        </Col>
    )
}


/**
 *
 * @param {array} layout - array of row sizes ([3, 4, 1]) describing grid
 * @param {string} [rowClassName] css class to be applied to rows
 * @param {string} colClassName css class to be applied to columns
 */
export const TCGrid = ({layout, rowClassName, colClassName, children}) => {
    if(!colClassName || typeof colClassName != "string") colClassName  = INTERNAL_COL_CSS
    if(!rowClassName || typeof rowClassName != "string") rowClassName = INTERNAL_ROW_CSS

    function wrapCols(arr, i){
        let cols = []
        for(var j = 0; j<arr.length; j++){
            cols.push(<TCCol key={i+"_"+j} className={colClassName} >{arr[j]}</TCCol>)
        }
        return cols
    }

    let els = React.Children.toArray(children)
    let rows = []
    let index = 0
    for(var i = 0; i<layout.length; i++){
        let colcount = layout[i]
        let cols = []
        let k = 0
        while(cols.length < colcount && ((index + k) < els.length)){
            if(els[k+index]) cols.push(els[k+index])
            k++
        }
        index += k
        rows.push(
            <TCRow key={i+"_" + k} className={rowClassName}>
                {wrapCols(cols, index)}
            </TCRow>
        )
    }
    return rows
}

/**
 * Generator functions which create TC elements from json configs
 */

/**
 * First one is super easy - converts arrays while screening out nulls so that misconfigured fields
 * are ignored at this stage and won't cause trouble further down the line
 * @param {} fields
 */
export const JSONTCFields = (fields, values, errors, onChangeField) => {

    if(!fields || !Array.isArray(fields)) return null
    let tcfields = []
    for(var i = 0; i< fields.length; i++){
        let tcf = JSONTCField(fields[i], values[fields[i].id], errors[fields[i].id], onChangeField, fields[i].id + "_key")
        if(tcf) tcfields.push(tcf)
    }
    return tcfields
}

export const JSONTCField = (field, value, error, onChangeField, key) => {
    if(!field || !field.id || !field.inputElement) return false
    return (<TCFormField
        key={key}
        field_id={field.id}
        value={value}
        inputElement={field.inputElement}
        mandatory={field.mandatory}
        className={field.className}
        label ={field.label}
        labelClassName ={field.labelClassName}
        help = {field.help}
        helpExpanded = {field.helpExpanded}
        helpRowClassName = {field.helpRowClassName}
        helpClassName = {field.helpClassName}
        helpLabelColClassName = {field.helpLabelColClassName}
        helpColClassName = {field.helpColClassName}
        helpCols = {field.helpCols}
        promptRowClassName = {field.promptRowClassName}
        inputRowClassName = {field.inputRowClassName}
        inputGutterClassName = {field.inputGutterClassName}
        cowDuckClassName = {field.cowDuckClassName}
        cowDuckIconClassName = {field.cowDuckIconClassName}
        errorRowClassName = {field.errorRowClassName}
        error = {error}
        onChangeField={onChangeField}
        fieldErrorClassName = {field.fieldErrorClassName}
    />)
}

export const JSONTCInputElement = (field_id, value, mandatory, onChange, elt) => {
    if(!elt || !elt.type) return null
    if(elt.type == "input"){
        return (
            <TCFormInput
                field_id={field_id}
                disabled ={elt.disabled}
                mandatory ={mandatory}
                value={value}
                className={elt.className}
                onChange={onChange}
                placeholder={elt.placeholder}
            />
        )
    }
    else if(elt.type == "select" && elt.options){
        return (
            <TCFormSelect
                field_id={field_id}
                disabled ={elt.disabled}
                mandatory ={mandatory}
                value={value}
                options={elt.options}
                className={elt.className}
                onChange={onChange}
                placeholder={elt.placeholder}
            />
        )
    }
    else if(elt.type == "textarea"){
        return (
            <TCFormTextarea
                field_id={field_id}
                disabled ={elt.disabled}
                mandatory ={mandatory}
                value={value}
                className={elt.className}
                onChange={onChange}
                placeholder={elt.placeholder}
            />
        )
    }
    else if(elt.type == "checkbox"){
        return (
            <TCFormCheckbox
                field_id={field_id}
                mandatory ={elt.mandatory}
                disabled ={elt.disabled}
                checked={value}
                className={elt.className}
                onChange={onChange}
                label={elt.label}
                placeholder={elt.placeholder}
            />
        )
    }
    return null
}

export const JSONTCButtons = ({buttons}) => {
    if(! buttons ) return null
    return (<TCFormSubmits
        className={buttons.className}
        buttonsClassName={buttons.buttonsClassName}
        onCancel={buttons.onCancel}
        cancelText={buttons.cancelText}
        cancelClassName={buttons.cancelClassName}
        submitText={buttons.submitText}
        submitClassName={buttons.submitClassName}
    />)
}

const _onChange = (ch, field_id) => {
    if(ch){
        let vchange = function(val){
            ch(field_id, val.target.value)
        }
        return vchange
    }
    return undefined
}

const _onSChange = (ch, field_id) => {
    if(ch){
        let vchange = function(SelValue){
            ch(field_id, SelValue.value)
        }
        return vchange
    }
    return undefined
}

const _onTChange = (ch, field_id) => {
    if(ch){
        let vchange = function(SelValue){
            ch(field_id, SelValue.target.checked)
        }
        return vchange
    }
    return undefined
}
