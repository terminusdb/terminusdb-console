/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import { TCForm } from  "../../components/Form/FormComponents"
import { CREATE_BRANCH_FORM  } from "./constants.dbmanage"
import { TERMINUS_SUCCESS, TERMINUS_ERROR } from "../../constants/identifiers";
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { DBContextObj } from "../../components/Query/DBContext"
import {Row, Col} from "reactstrap"

export const Branch = ({onCancel, onCreate, onEdit, visible}) => {
    const {woqlClient} = WOQLClientObj();
    const {branch, ref, consoleTime} = DBContextObj();

    
    visible = visible || false
    
    let ics = {}
    CREATE_BRANCH_FORM.fields.map((item) => {
        ics[item.id] = item.value || ""
    })

    const [values, setValues] = useState(ics)
    const [report, setReport] = useState()

    let btns = CREATE_BRANCH_FORM.buttons
   

    function onCreate(){
        woqlClient.branch(values.bid)
        .then(() => {
            setReport({ status: TERMINUS_SUCCESS })
        })
        .catch((e) => {
            setReport({ status: TERMINUS_ERROR, message: "Failed to create branch", error: e})
        })
    }

    function onUpdate(key, val){
        values[key] = val
        setValues(values)
    }

    function showCurrentHead(){
        return (
            <Row>
                <Col>Branch From</Col>
                <Col>Branch:  {branch}</Col>
                <Col>Ref: {ref || "head"}</Col>
                <Col>Time: {consoleTime}</Col>
            </Row>
        )
    }

    if(report && report.status == TERMINUS_SUCCESS){
        return (<TerminusDBSpeaks report={{status: "success",  message:"Successfully Created New Branch"}} />)
    }
    return (<>
        {showCurrentHead()}    
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[1, 1]}
            onChange={onUpdate}
            fields={CREATE_BRANCH_FORM.fields}
            values={values}
            buttons={btns} 
        />
    </>)
}