/**
 * Controller application for branch creation form
 */
import React, {useState} from "react";
import {TCForm, TCSubmitWrap} from  "../../../components/Form/FormComponents"
import { CREATE_BRANCH_FORM, BRANCH_BUTTON } from "../constants"
import { Button } from "reactstrap";
import { HistoryNavigator} from "../../../components/HistoryNavigator/HistoryNavigator"
import { TERMINUS_SUCCESS, TERMINUS_ERROR } from "../../../constants/identifiers";
import { APIUpdateReport } from "../../../components/Reports/APIUpdateReport";
import { WOQLClientObj } from "../../../init/woql-client-instance";

export const CreateBranch = ({onCancel, onCreate, onEdit, visible}) => {
    const {woqlClient} = WOQLClientObj();
    visible = visible || false
    const [isVisible, setVisible] = useState(visible)
    let ics = {}
    let ls = CREATE_BRANCH_FORM.fields.map((item) => {
        ics[item.id] = item.value || ""
    })

    const [values, setValues] = useState(ics)
    const [report, setReport] = useState()

    if(!isVisible){
        return (
            <TCSubmitWrap>
                <Button className="tcf-secondary" onClick={() => setVisible(true)} outline color="secondary">
                    {BRANCH_BUTTON}
                </Button>
            </TCSubmitWrap>            
        )
    }

    let btns = CREATE_BRANCH_FORM.buttons
    btns.onCancel = function(){
        setVisible(false)
    }

    function onCreate(){
        woqlClient.ref(values.source)
        woqlClient.branch(values.bid)
        .then(() => {
            setReport({ status: TERMINUS_SUCCESS })
        })
        .catch((e) => {
            setReport({ status: TERMINUS_ERROR, message: "Failed to create branch", error: e})
        })
    }


    function headChanged(branch, ref){
        let nf = values
        nf.source = ref
        setValues(nf)
    }
    if(report && report.status == TERMINUS_SUCCESS){
        return (<APIUpdateReport status="success" message="Successfully Created New Branch" />)
    }
    return (        
        <TCForm 
            onSubmit={onCreate} 
            report={report} 
            layout = {[2, 1]}
            fields={CREATE_BRANCH_FORM.fields}
            values={values}
            buttons={btns} 
        >
            <HistoryNavigator onHeadChange={headChanged} />
        </TCForm>       
    )
}