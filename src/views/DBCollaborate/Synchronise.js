/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'
import {
    PUSH_REMOTE_FORM,
    SYNCHRONISE_FORM,
    PUSH_LOCAL_FORM,
    PULL_LOCAL_FORM,
    PULL_REMOTE_FORM,
    DEFAULT_LOCAL_PULL_COMMIT,
    DEFAULT_LOCAL_PUSH_COMMIT,
    DEFAULT_REMOTE_PULL_COMMIT,
    DEFAULT_REMOTE_PUSH_COMMIT,
} from './constants.dbcollaborate'
import {DBContextObj} from '../../components/Query/DBContext'
import {TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import Loading from '../../components/Reports/Loading'
import {UnderConstruction} from '../../components/Reports/UnderConstruction'

export const Synchronise = () => {
    const {repos, branches, updateBranches} = DBContextObj()

    const { getTokenSilently } = useAuth0();

    const [sourceValues, setSourceValues] = useState()
    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [operation, setOperation] = useState()
    const [isRemote, setIsRemote] = useState()
    const { woqlClient } = WOQLClientObj()

    let update_start = Date.now()

    useEffect(() => {
        if (repos) {
            let rem = repos.remote || repos.local_clone
            setSourceValues({
                remote_url: rem.url,
                remote: rem.title,
                operation: '',
            })
            if (repos.remote) setIsRemote(true)
            else setIsRemote(false)
        }
    }, [repos])

    function updateOperation(field, val) {
        let s = {}
        s.remote_url = sourceValues.remote_url
        s.remote = sourceValues.remote
        s.operation = val
        setOperation(val)
        setSourceValues(s)
    }

    function getBranchOptions() {
        let bopts = Object.values(branches).map((item) => {
            return {label: item.id, value: item.id}
        })
        return bopts
    }

    if (!repos || !branches) {
        return <Loading type={TERMINUS_COMPONENT} />
    }

    let remote_push_fields = PUSH_REMOTE_FORM.fields.map((item) => {
        if (item.id == 'local_branch') item.inputElement.options = getBranchOptions()
        return item
    })

    let local_push_fields = PUSH_LOCAL_FORM.fields.map((item) => {
        if (item.id == 'local_branch') item.inputElement.options = getBranchOptions()
        return item
    })

    let remote_pull_fields = PULL_REMOTE_FORM.fields.map((item) => {
        if (item.id == 'local_branch') item.inputElement.options = getBranchOptions()
        return item
    })

    let local_pull_fields = PULL_LOCAL_FORM.fields.map((item) => {
        if (item.id == 'local_branch') item.inputElement.options = getBranchOptions()
        return item
    })

    function pushLocal(deets) {
        let from_branch = deets.local_branch || 'master'
        let commit = deets.commit || DEFAULT_LOCAL_PUSH_COMMIT
        let push_to = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'master',
            message: commit,
        }
        //create copy so we don't change internal state of woqlClient inadvertently
        let nClient = woqlClient.copy()

        nClient.remote_auth( nClient.local_auth() )
        nClient.checkout(from_branch)
        setLoading(true)
        update_start = Date.now()
        nClient
            .push(push_to)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pushSuccessMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPush()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pushFailureMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function pullLocal(deets) {
        let to_branch = deets.local_branch || 'master'
        let commit = deets.commit || DEFAULT_LOCAL_PULL_COMMIT
        let pull_from = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'master',
            message: commit,
        }
        //create copy so we don't change internal state of woqlClient inadvertently
        let nClient = woqlClient.copy()
        nClient.remote_auth(nClient.local_auth())
        if (to_branch != nClient.checkout()) nClient.checkout(to_branch)
        update_start = Date.now()
        setLoading(true)
        nClient
            .pull(pull_from)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pullSuccessMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPull()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pullFailureMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function afterPush() {
        //alert("Push was successful")
    }

    function afterPull() {
        updateBranches()
    }

    async function pushRemote(deets) {
        let from_branch = deets.local_branch || 'master'
        let commit = deets.commit || DEFAULT_REMOTE_PUSH_COMMIT
        let push_to = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'master',
            message: commit,
        }
        update_start = Date.now()

        let nClient = woqlClient.copy()
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
       

        //if (deets.user && deets.password) {
        //    nClient.remote_auth({type: 'basic', key: deets.password, user: deets.user})
        //}
        nClient.checkout(from_branch)
        setLoading(true)
        nClient
            .push(push_to)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pushSuccessMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPush()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pushFailureMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    async function pullRemote(deets) {
        let to_branch = deets.local_branch || 'master'
        let commit = deets.commit || DEFAULT_REMOTE_PULL_COMMIT
        let pull_from = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || 'master',
            message: commit,
        }
        let nClient = woqlClient.copy()
        const jwtoken = await getTokenSilently()
        nClient.remote_auth({type: "jwt", key: jwtoken})
 
        //if (deets.user && deets.password) {
        //    nClient.remote_auth({type: 'basic', key: deets.password, user: deets.user})
        //}
        if (to_branch != nClient.checkout()) nClient.checkout(to_branch)
        setLoading(true)
        update_start = Date.now()
        nClient
            .pull(pull_from)
            .then((res) => {
                let message = `${SYNCHRONISE_FORM.pullSuccessMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterPull()
            })
            .catch((err) => {
                let message = `${SYNCHRONISE_FORM.pullFailureMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setLoading(false)
            })
    }

    if (report && report.status == TERMINUS_SUCCESS) {
        return <TerminusDBSpeaks report={report} />
    }

    let user = woqlClient.user()
    let pushButtons = user.logged_in ? PUSH_REMOTE_FORM.buttons : false
    let pullButtons = user.logged_in ? PULL_REMOTE_FORM.buttons : false

    return (
        <>
            {loading && <Loading type={TERMINUS_COMPONENT} />}
            <TCForm
                onChange={updateOperation}
                values={sourceValues}
                layout={[3]}
                fields={SYNCHRONISE_FORM.fields}
            />
            {!user && operation && operation == 'push' && (
                <TCSubmitWrap>
                    <UnderConstruction action={PUSH_REMOTE_FORM.buttons.submitText} />
                </TCSubmitWrap>
            )}
            {operation && operation == 'push' && isRemote && (
                <TCForm
                    fields={remote_push_fields}
                    layout={[2, 2, 1]}
                    report={report}
                    onSubmit={pushRemote}
                    buttons={pushButtons}
                />
            )}
            {operation && operation == 'push' && !isRemote && (
                <TCForm
                    fields={local_push_fields}
                    layout={[2, 1]}
                    report={report}
                    onSubmit={pushLocal}
                    buttons={pushButtons}
                />
            )}
            {!user && operation && operation == 'pull' && (
                <TCSubmitWrap>
                    <UnderConstruction action={PULL_REMOTE_FORM.buttons.submitText} />
                </TCSubmitWrap>
            )}
            {operation && isRemote && operation == 'pull' && (
                <TCForm
                    fields={remote_pull_fields}
                    report={report}
                    layout={[2, 2, 1]}
                    onSubmit={pullRemote}
                    buttons={pullButtons}
                />
            )}
            {operation && !isRemote && operation == 'pull' && (
                <TCForm
                    fields={local_pull_fields}
                    report={report}
                    layout={[2, 1]}
                    onSubmit={pullLocal}
                    buttons={pullButtons}
                />
            )}
        </>
    )
}
