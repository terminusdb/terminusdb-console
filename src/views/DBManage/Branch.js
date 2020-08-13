/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {TCForm} from '../../components/Form/FormComponents'
import {CREATE_BRANCH_FORM, BRANCH_SOURCE_FORM} from './constants.dbmanage'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_INFO,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {printts} from '../../constants/dates'
//import {CommitSelector} from "./CommitSelector"
import Loading from '../../components/Reports/Loading'

export const Branch = () => {
    const {woqlClient} = WOQLClientObj()
    const {branch, ref, branches, consoleTime, updateBranches} = DBContextObj()

    let ics = {}
    CREATE_BRANCH_FORM.fields.map((item) => {
        ics[item.id] = item.value || ''
    })

    let update_start = Date.now()

    const [values, setValues] = useState(ics)
    const [sourceValues, setSourceValues] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setSourceValues({
            branch: branch,
            ref: ref || 'head',
            time: consoleTime ? printts(consoleTime) : 'now',
        })
    }, [branch, ref, consoleTime])

    const [report, setReport] = useState()

    let btns = CREATE_BRANCH_FORM.buttons

    function onCreate() {
        setLoading(true)
        update_start = Date.now()
        woqlClient.checkout(sourceValues.branch)
        woqlClient
            .branch(values.bid)
            .then(() => {
                let message = `${CREATE_BRANCH_FORM.branchSuccessMessage} ${values.bid}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                updateBranches()
            })
            .catch((err) => {
                let message = `${CREATE_BRANCH_FORM.branchFailureMessage} ${values.bid} `
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function onSourceUpdate(key, val) {
        if(key == "branch"){
            let x = {}
            x.branch = val
            x.ref = sourceValues.ref
            x.time = sourceValues.time
            setSourceValues(x)
        }
    }

    function onUpdate(key, val) {
        values[key] = val
        setValues(values)
    }

    if (report && report.status == TERMINUS_SUCCESS) {
        return <TerminusDBSpeaks report={report} />
    }
    return (
        <>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            {/*<CommitSelector branch={branch} branches={branches} commit={ref} /> */}
            <TCForm
                layout={[3]}
                fields={BRANCH_SOURCE_FORM.fields}
                onChange={onSourceUpdate}
                values={sourceValues}
                report={{status: TERMINUS_INFO, message: BRANCH_SOURCE_FORM.infoMessage}}
            />
            <TCForm
                onSubmit={onCreate}
                report={report}
                layout={[1, 1]}
                onChange={onUpdate}
                fields={CREATE_BRANCH_FORM.fields}
                values={values}
                buttons={btns}
            />
        </>
    )
}
