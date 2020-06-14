/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from "react";
import {TCForm} from  "../../components/Form/FormComponents"
import { PUSH_REMOTE_FORM, SYNCHRONISE_FORM, PUSH_LOCAL_FORM, PULL_LOCAL_FORM, PULL_REMOTE_FORM, DEFAULT_LOCAL_PUSH_COMMIT} from "./constants.dbcollaborate"
import { DBContextObj } from "../../components/Query/DBContext"
import { TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS } from "../../constants/identifiers";
import { WOQLClientObj } from "../../init/woql-client-instance";
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"
import Loading from "../../components/Reports/Loading"

export const Synchronise = () => {
    const {repos, branches, updateBranches} = DBContextObj();

    const [sourceValues, setSourceValues] = useState()
    const [loading, setLoading] = useState()
    const [report, setReport] = useState()
    const [operation, setOperation] = useState()
    const [isRemote, setIsRemote] = useState()
    const {woqlClient} = WOQLClientObj();
    
    useEffect(() => {
        if(repos){          
            let rem = repos.remote || repos.local_clone
            setSourceValues({
                remote_url: rem.url,
                remote: rem.title,
                operation: ""
            })
            if(repos.remote) setIsRemote(true)
            else setIsRemote(false)
        }
    }, [repos])  

    function updateOperation(field, val){
        let s = {}
        s.remote_url = sourceValues.remote_url
        s.remote = sourceValues.remote
        s.operation = val
        setOperation(val)
        setSourceValues(s)
    }

    function getBranchOptions(){
        let bopts = Object.values(branches).map( (item) => {
            return {label: item.id, value: item.id}
        })
        return bopts
    }

    if(!repos || !branches){
        return (<Loading type={TERMINUS_COMPONENT} />)
    }

    let remote_push_fields = PUSH_REMOTE_FORM.fields.map((item) => {
        if(item.id == "local_branch") item.inputElement.options = getBranchOptions()
        return item    
    }) 

    let local_push_fields = PUSH_LOCAL_FORM.fields.map((item) => {
        if(item.id == "local_branch") item.inputElement.options = getBranchOptions()
        return item    
    }) 

    let remote_pull_fields = PULL_REMOTE_FORM.fields.map((item) => {
        if(item.id == "local_branch") item.inputElement.options = getBranchOptions()
        return item    
    }) 

    let local_pull_fields = PULL_LOCAL_FORM.fields.map((item) => {
        if(item.id == "local_branch") item.inputElement.options = getBranchOptions()
        return item    
    }) 

    function pushLocal(deets){
        let from_branch = deets.local_branch || "master"
        let commit = deets.commit || DEFAULT_LOCAL_PUSH_COMMIT
        let push_to = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || "master",
            author: woqlClient.uid(),
            message: commit
        }
        let abc = woqlClient.basic_auth()
        woqlClient.remote_auth({type: "basic", key: abc.split(":")[1], user: abc.split(":")[0]})
        woqlClient.checkout(from_branch)
        setLoading(true)
        woqlClient.push(push_to)
        .then((res) => {
            let message = `${SYNCHRONISE_FORM.pushSuccessMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterPush()  
        })
        .catch((err) => {
            let message = `${SYNCHRONISE_FORM.pushFailureMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setLoading(false)
        })    
    }

    function pullLocal(deets){
        let to_branch = deets.local_branch || "master"
        let commit = deets.commit || DEFAULT_LOCAL_PULL_COMMIT
        let pull_from = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || "master",
            author: woqlClient.uid(),
            message: commit
        }
        let abc = woqlClient.basic_auth()
        woqlClient.remote_auth({type: "basic", key: abc.split(":")[1], user: abc.split(":")[0]})
        if(to_branch != woqlClient.checkout()) woqlClient.checkout(to_branch)
        setLoading(true)
        woqlClient.pull(pull_from)
        .then((res) => {
            let message = `${SYNCHRONISE_FORM.pullSuccessMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterPull()  
        })
        .catch((err) => {
            let message = `${SYNCHRONISE_FORM.pullFailureMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setLoading(false)
        })    
    }


    function afterPush(){     
        alert("Push was successful")
    }

    function afterPull(){
        alert("Push was successful")
    }


    function pushRemote(deets){
        let from_branch = deets.local_branch || "master"
        let commit = deets.commit || DEFAULT_LOCAL_PUSH_COMMIT
        let push_to = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || "master",
            author: woqlClient.uid(),
            message: commit
        }
        if(deets.user && deets.password){
            woqlClient.remote_auth({type: "basic", key: deets.password, user: deets.user})
        }
        woqlClient.checkout(from_branch)
        setLoading(true)
        woqlClient.push(push_to)
        .then((res) => {
            let message = `${SYNCHRONISE_FORM.pushSuccessMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterPush()  
        })
        .catch((err) => {
            let message = `${SYNCHRONISE_FORM.pushFailureMessage} from branch ${from_branch} to ${push_to.remote} ${push_to.remote_branch}`
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setLoading(false)
        })    
    }


    function pullRemote(deets){
        let to_branch = deets.local_branch || "master"
        let commit = deets.commit || DEFAULT_LOCAL_PULL_COMMIT
        let pull_from = {
            remote: sourceValues.remote,
            remote_branch: deets.remote_branch || "master",
            author: woqlClient.uid(),
            message: commit
        }
        if(deets.user && deets.password){
            woqlClient.remote_auth({type: "basic", key: deets.password, user: deets.user})
        }
        if(to_branch != woqlClient.checkout()) woqlClient.checkout(to_branch)
        setLoading(true)
        woqlClient.pull(pull_from)
        .then((res) => {
            let message = `${SYNCHRONISE_FORM.pullSuccessMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
            let rep = {message: message, status: TERMINUS_SUCCESS, time: (Date.now() - update_start)}
            setReport(rep)     
            afterPull()  
        })
        .catch((err) => {
            let message = `${SYNCHRONISE_FORM.pullFailureMessage} from branch ${to_branch} to ${pull_from.remote} ${pull_from.remote_branch}`
            setReport({error: err, status: TERMINUS_ERROR, message: message});
        })
        .finally(() => {
            setLoading(false)
        })    
    }


    if(report && report.status == TERMINUS_SUCCESS){
        return (<TerminusDBSpeaks report={{status: "success",  message:"Successfully Merged into Branch"}} />)
    }
    return (<>
        {loading && 
            <Loading type={TERMINUS_COMPONENT} />
        }
        <TCForm 
            onChange={updateOperation}
            values={sourceValues} 
            layout = {[3]}
            fields={SYNCHRONISE_FORM.fields}
        />
        {(operation && operation == 'push' && isRemote) && 
            <TCForm 
                fields={remote_push_fields}
                layout = {[2,2,1]}
                report={report} 
                onSubmit = {pushRemote}
                buttons = {PUSH_REMOTE_FORM.buttons}
            />
        }       
        {(operation && operation == 'push' && !isRemote) && 
            <TCForm 
                fields={local_push_fields}
                layout = {[2,1]}
                report={report} 
                onSubmit = {pushLocal}
                buttons = {PUSH_LOCAL_FORM.buttons}
            />
        }       
        {(operation && isRemote && operation == 'pull') && 
            <TCForm 
                fields={remote_pull_fields}
                report={report} 
                layout = {[2,2,1]}
                onSubmit = {pullRemote}
                buttons = {PULL_REMOTE_FORM.buttons}
            />
        }       
        {(operation && !isRemote && operation == 'pull') && 
            <TCForm 
                fields={local_pull_fields}
                report={report} 
                layout = {[2,1]}
                onSubmit = {pullLocal}
                buttons = {PULL_LOCAL_FORM.buttons}
            />
        }       
    </>)
}


/* Pull

remote: "origin"
remote_branch: "name of branch"
pull_into: local_branch

pull to branch -> pull/admin/foo/local/branch/pull_into 


Push push/admin/foo/local/branch/something (source of the push)

Always just a local branch

Target "origin"
remote: "origin"d
remote_branch: "name of branch" */
