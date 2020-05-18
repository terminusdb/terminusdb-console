import React, { useState, useEffect } from "react";
import { Col, Button, Row, Container } from "reactstrap";
import Loading from "../../components/Loading";
import { useForm } from 'react-hook-form';
import { WOQLClientObj } from "../../init/woql-client-instance";
import Select from "react-select";
import {TCFormSubmits, TCForm, TCFormInput, TCFormField, TCFormSelect, TCFormCheckbox, TCFormTextarea, TCCol, TCRow, TCSubmitWrap} from  "../../components/Form/FormComponents"
import {APIUpdateReport} from "../../components/Reports/APIUpdateReport"
import {REQUIRED_FIELD_ERROR, ILLEGAL_ID_ERROR, INTERNAL_COL_CSS} from "../../components/Form/constants"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_INFO} from "../../constants/identifiers"
import { CREATE_GRAPH_FORM } from "./constants"



export const CreateGraph = ({onCancel, onCreate, onEdit, visible, report}) => {

    const [formInfo, setFormInfo] = useState({
        gid: "", gtype: "", commit: ""
    })
    const [formErrors, setFormErrors] = useState({})


    function findError(field, val){
        val = val.trim()
        if(val == "" && field != "commit") return REQUIRED_FIELD_ERROR
        if(field == "gid" && val.indexOf(" ") != -1 || val.indexOf(":") != -1 || val.indexOf("/") != -1){
            return ILLEGAL_ID_ERROR
        }
        return false
    }

    function onSubmit(data){
        let nformErrors = {}
        let ok = true
        for(var i in formInfo){
            let e = findError(i, formInfo[i])
            if(e) {
                nformErrors[i] = e
                ok = false
            }
        }
        setFormErrors(nformErrors)
        if(ok){
            onCreate(formInfo.gid, formInfo.gtype, formInfo.commit )
        }
    }

    if(!visible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={onEdit} outline color="secondary">
                    {CREATE_GRAPH_FORM.createButtonText}
                </Button>
            </TCSubmitWrap>            
        )
    }

    function onChangeField(field_id, value){
        formInfo[field_id] = value
        setFormInfo(formInfo)
    }

    return (
        <TCForm onSubmit={onSubmit} >
            <TCFormSubmits submitText={CREATE_GRAPH_FORM.createButtonText} visible={visible} cancel= {CREATE_GRAPH_FORM.cancelButtonText} onCancel={onCancel} onEdit={onEdit} />
            {report && 
                <APIUpdateReport error = { report.error } message={report.message} status={report.status} time={report.time}/>
            }
            <TCRow>
                <TCCol>
                    <TCFormField error={formErrors} field_id="gid" mandatory label={CREATE_GRAPH_FORM.fields["gid"].label}  help={CREATE_GRAPH_FORM.fields["gid"].help}>
                        <TCFormInput field_id="gid" mandatory placeholder={CREATE_GRAPH_FORM.fields["gid"].placeholder} onChange={onChangeField}/>
                    </TCFormField>
                </TCCol>
                <TCCol>
                    <TCFormField error={formErrors} field_id="gtype" mandatory label={CREATE_GRAPH_FORM.fields["gtype"].label} help={CREATE_GRAPH_FORM.fields["gtype"].help}>
                        <TCFormSelect placeholder={CREATE_GRAPH_FORM.fields["gtype"].placeholder} field_id="gtype" options={CREATE_GRAPH_FORM.fields["gtype"].options} onChange={onChangeField} />
                    </TCFormField>
                </TCCol>
            </TCRow>
            <TCRow>
                <TCCol>
                    <TCFormField error={formErrors} field_id="commit" mandatory label={CREATE_GRAPH_FORM.fields["commit"].label} help={CREATE_GRAPH_FORM.fields["commit"].help}>
                        <TCFormTextarea placeholder={CREATE_GRAPH_FORM.fields["commit"].placeholder} field_id="commit" onChange={onChangeField} />
                    </TCFormField>
                </TCCol>
            </TCRow>
        </TCForm>
    )
}

