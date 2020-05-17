import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import Loading from "../../components/Loading";
import { createGraphText } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';
import { WOQLClientObj } from "../../init/woql-client-instance";
import Select from "react-select";
import {TCFormSubmits, TCForm, TCFormInput, TCFormField, TCFormSelect, TCFormCheckbox, TCFormTextarea} from  "../../components/Form/FormComponents"
 

export const CreateGraph = ({onCancel, onCreate}) => {

    const { register, handleSubmit, errors } = useForm();

    const [dbInfo, setDbInfo] = useState({gid: "", gtype: ""});

    function generateFieldLabel(field_id, meta){
        let cname = createGraphText.labelClassName
        let cbits = ""
        if(field_id == "gid") cbits =showMandatory(meta.label)
        let lab = (
            <label className={cname} htmlFor={field_id}>
                {meta.label} {cbits}                 
            </label>
        )
        return lab
    }

    function generateFieldInput(field_id, meta){
        if(field_id == "gid"){
            let ph = meta.placeholder || ""
            let val = dbInfo[field_id] || ""
            return (
                <input
                    placeholder={ ph }
                    className = {createGraphText.inputClassName }
                    defaultValue={val}
                    name = {field_id}
                    ref = { register({ validate: value => value.length > 0}) }/>
            )                   
        }
        if(field_id == "gtype"){
            let ph = meta.placeholder || ""
            return(<Select placeholder = {ph}
                className = {createGraphText.selectClassName}
                ref={register}
                options = {[
                    {label: "Data", value: "instance"}, 
                    {label: "Schema",  value: "schema"}, 
                    {label: "Inference", value: "inference"}]}
                />
            )        
        }
    }

    function generateFieldPrompt(field_id, meta){
        if(errors[field_id]){
            return (
                <p className = {createGraphText.errorClassName}>
                    {meta.label + " " + createGraphText.requiredField} 
                </p>
            )
        }
        if(meta.help){
            return (
                <p className = {createGraphText.helpClassName}>
                    {meta.help} 
                </p>
            )
        }
        return null
    }

    function generateFormField(field_id, meta){
        let x = generateFieldLabel(field_id, meta)
        let y =  generateFieldInput(field_id, meta)
        let z =  generateFieldPrompt(field_id, meta)
        return (
            <span class='form-field'>{x}{y}{z}</span>
        )
    }

    function onSubmit(data){
        alert(JSON.stringify(data))
    }

    let typeField = generateFormField("gtype", createGraphText.fields.gtype)
    let idField = generateFormField("gid", createGraphText.fields.gid)

    function showMandatory(label){
        return (<strong 
            title={label + " " + createGraphText.requiredField} 
            style={{"color": "red"}} 
            className={createGraphText.errorClassName}>
                * 
        </strong>)
    }

    function showSubmitPane(){
        return (
            <div class="some-submit-pane">
                <button type="cancel" className={createGraphText.cancelButtonClassName}>
                    {createGraphText.cancelButtonText}
                </button><span style={{"padding-right": 10}}>&nbsp;</span>
                <button type="submit" className={createGraphText.createButtonClassName}>
                    {createGraphText.createButtonText}
                </button>
            </div>
        )
    }

    //export const TCFormField = ({field_id, mandatory, className, label, labelClassName, 
    //    help, helpRowClassName, helpClassName, promptRowClassName, inputRowClassName, inputGutterClassName,
    //    cowDuckClassName, errorRowClassName, error, fieldErrorClassName, children}) => {
    return (
        <Col>
            <TCForm onSubmit={onSubmit} >
                <TCFormSubmits /> 
                <Row>
                    <Col>
                        <TCFormField field_id="xyz" mandatory label="XYZ Yeah" help="Team America">
                            <TCFormInput />
                        </TCFormField>
                    </Col>
                    <Col>
                        <TCFormField field_id="zpc" mandatory label="x" help="whoops">
                            <TCFormSelect options={[{label: "a", value: "b"}]} />
                        </TCFormField>
                    </Col>
                    <Col>
                        <TCFormField field_id="zpc" mandatory label="x" help="whoops">
                            <TCFormCheckbox />
                        </TCFormField>
                    </Col>
                </Row>
                <Row>
                    <TCFormField field_id="zc" mandatory label="x" help="whoops">
                        <TCFormTextarea />
                    </TCFormField>
                </Row>
            </TCForm>
        </Col>
    )
}

