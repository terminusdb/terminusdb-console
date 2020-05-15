import React, { useState } from "react";
import { HistoryNavigator } from "../../components/HistoryNavigator/HistoryNavigator"
import { WOQLClientObj } from "../../init/woql-client-instance";
import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import Loading from "../../components/Loading";
import { createGraphText } from "../../variables/formLabels"
import { useForm } from 'react-hook-form';

const CreateBranch = (props) => {
    const {woqlClient} = WOQLClientObj();

    const onCreateBranch = (data) => {
        woqlClient.branch(data.bid, data.uri_prefix)
        .then(() => {
            //report some success
        })
        .catch((e) => {

        }
    }

    function handleBranch(){
        let nuid = newBranch.value
        props.onBranch(nuid)
    }

    function headChanged(b, r){
    }

    function generateFieldLabel(field_id, meta){
        let cname = "form"
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

    <Label><b>Create New Branch</b></Label>
			 <hr className = "my-space-25"/>
			 <HistoryNavigator  onHeadChange={headChanged} />



             
             export const CreateGraph = ({onCancel, onCreate}) => {
             
                 const { register, handleSubmit, errors } = useForm();
             
                 const [dbInfo, setDbInfo] = useState({gid: "", gtype: ""});
             

             
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
             
             
                 return (<form onSubmit={handleSubmit(onSubmit) }>
                     <Container>
                         <Row>
                             <button type="cancel" className={createGraphText.cancelButtonClassName}>
                                     {createGraphText.cancelButtonText}
                             </button><span style={{"padding-right": 10}}>&nbsp;</span>
                             <button type="submit" className={createGraphText.createButtonClassName}>
                                     {createGraphText.createButtonText}
                             </button>
                         </Row>
                         <Row>
                             <Col>{typeField}</Col><Col>{idField}</Col>
                         </Row>
                     </Container>
                 </form>)
             }             