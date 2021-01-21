/**
 * Display differences between local and remote branches
 */
import React from 'react'
import {Row, Col} from "react-bootstrap" //replaced
import { printts } from "../../constants/dates"
import { DATETIME_COMPLETE } from "../../constants/dates"
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineDown, AiOutlineUp, AiOutlineCheck,
    AiOutlineCloudSync, AiOutlineBranches, AiOutlineQuestion, AiOutlineExclamation, 
    AiOutlineCloudDownload} from 'react-icons/ai';

function _containsBranch(bid, barr){
    for(var i = 0; i<barr.length; i++){
        if(barr[i].branch == bid) return i
    }
    return false
}


export const DescribeDifferences = ({a, b}) => {
    let comps = []
    let bdesc = {}
    if(!a.branches){
        comps.push(<DBUnsynchCredits key="dbs5" text="local database is uninitialized" />)
        return comps
    }
    if(!b.branches){
        comps.push(<DBUnsynchCredits key="dbd5" text="remote database is uninitialized" />)
        return comps
    }
    for(var i = 0; i<a.branches.length; i++){
        let myb = a.branches[i]
        let index = _containsBranch(myb.branch, b.branches)
        let diff = false
        if(index !== false){
            let otherb = b.branches[index]
            if(otherb.head != myb.head){
                if(otherb.updated > myb.updated){
                    diff = "remote ahead"
                }
                else {
                    diff = "local ahead"
                }
            }
        }
        else diff = "no remote"
        bdesc[myb.branch] = diff
    }
    for(var i = 0; i<b.branches.length; i++){
        if(typeof bdesc[b.branches[i].branch] == "undefined"){
            bdesc[b.branches[i].branch] = "no local"
        }
    }
    if(a.branches.length == 1 && b.branches.length == 1 && a.branches[0].branch == b.branches[0].branch){
        if(!bdesc[a.branches[0].branch]){
            comps.push(<DBSynchCredits key="db1" text="Databases synchronized" />)
        }
        else {
            let str = "Databases out of synch: "
            if(a.branches[0].updated > b.branches[0].updated){
                str += "local is ahead of remote"
            }
            else {
                str += "remote is ahead of local"
            }
            comps.push(<DBUnsynchCredits key="db2" text={str} />)
        }
    }
    else {
        let acount = a.branches.length
        let bcount = b.branches.length
        let local_onlies = []
        let remote_onlies = []
        let local_ahead = []
        let remote_ahead = []
        let synchs = []
        for(var key in bdesc){
            let item = bdesc[key]
            if(item == "no local") remote_onlies.push(key)
            else if(item == "no remote") local_onlies.push(key)
            else if(item == "local ahead") local_ahead.push(key)
            else if(item == "remote ahead") remote_ahead.push(key)
            else synchs.push(key)
        }
        let lcount = (acount == 1 ? acount + " branch" : acount + " branches" )
        let str = `local has ${lcount}, remote has ${bcount}`
        comps.push(<DBBranchCredits key="db4" text={str} />)

        if(local_onlies.length + remote_onlies.length == 0){
            str = "all branches shared"
            comps.push(<DBSynchCredits key="db34" text={str} />)
        }
        else {
            str = ""
            if(local_onlies.length == 1){
                str += ` ${local_onlies[0]} branch only exists locally. `
            }
            else if(local_onlies.length > 1){
                str+= ` ${local_onlies.length} branches only exist locally. `
            }
            if(remote_onlies.length == 1){
                str+= ` ${remote_onlies[0]} branch only exists on remote. `
            }
            else if(remote_onlies.length > 1){
                str+= ` ${remote_onlies.length} branches only exist on remote. `
            }
            comps.push(<DBUnsynchCredits key="dbg5" text={str} />)
        }
        if(local_ahead.length + remote_ahead.length + synchs.length > 0){
            if(local_ahead.length + remote_ahead.length > 0){
                if(local_ahead.length == 1){
                    let txt = `local branch ${local_ahead[0]} ahead of remote`
                    comps.push(<DBUnsynchCredits key="dbh6" text={txt} />)
                }
                else if(local_ahead.length > 1) {
                    let txt = `${local_ahead.length} local branches ahead of remote`
                    comps.push(<DBUnsynchCredits key="dby7" text={txt} />)
                }
                if(remote_ahead.length == 1){
                    let txt = `remote branch ${remote_ahead[0]} ahead of local`
                    comps.push(<DBUnsynchCredits key="fre" text={txt} />)
                }
                else if(remote_ahead.length > 1) {
                    let txt = `${remote_ahead.length} remote branches ahead of local`
                    comps.push(<DBUnsynchCredits key="db8" text={txt} />)
                }
                if(synchs.length == 1){
                    let txt = `1 branch synchronized (${synchs[0]})`
                    comps.push(<DBSynchCredits key="db9" text={txt} />)
                }
                else if(synchs.length > 1) {
                    let txt = `${synchs.length} branches synchronized`
                    comps.push(<DBSynchCredits key="db10" text={txt} />)
                }
            }
            else {
                comps.push(<DBSynchCredits key="db11" text="all branches synchronized" />)
            }
        }
        else {
            comps.push(<DBUnsynchCredits key="db12" text="no common branches" />)
        }
    }
    return comps
}

export const DBSynchCredits = ({text}) => {
    return (
        <span className="db-card-credit">
            <AiOutlineCheckCircle title="Synchronized" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}

export const DBBranchCredits = ({text}) => {
    return (
        <span className="db-card-credit">
            <AiOutlineBranches title="Branch Synchronization" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}

export const DBUnsynchCredits = ({text}) => {
    return (
        <span className="db-card-credit">
            <AiOutlineCloudSync title="Branches out of synch" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}

export const RemoteComparison = ({local, remote, repo, onPush, onPull}) => {
    if(!(local.branches && local.branches.length)) return null
    let branch_comp = []
    for(var i = 0; i<local.branches.length; i++){ 
        let b = local.branches[i].branch            
        if(remote && remote.branches){
            let rem = _containsBranch(b, remote.branches)
            branch_comp.push(
                <BranchComparison 
                    repo={repo} 
                    onPush={onPush} 
                    onPull={onPull} 
                    key={"bb_" + i} 
                    branch={b} 
                    local={local.branches[i]} 
                    remote={remote.branches[rem]} 
                />
            )
        }
        else {
            branch_comp.push(
                <UnknownComparison 
                    repo={repo}
                    onPush={onPush}
                    onPull={onPull}
                    key={"ub_" + i}
                    branch={b}
                    local={local.branches[i]} />
            )
        } 
    }
    if(remote && remote.branches){
        for(var i = 0; i<remote.branches.length; i++){ 
            let b2 = remote.branches[i].branch            
            if(_containsBranch(b2, local.branches) === false){
                branch_comp.push(
                    <BranchComparison 
                        repo={repo} 
                        onPush={onPush} 
                        onPull={onPull} 
                        key={"bz_" + i} 
                        branch={b2} 
                        remote={remote.branches[i]} 
                    />
                )
            }
        }        
    }
    return (<Col>
        <Row className="remote-comparison-headers-row">
            <Col md={1} className="remote-comparison-headers">
            </Col>
            <Col className="remote-comparison-headers">
                Latest Local Commit
            </Col>
            <Col md={1} className="remote-comparison-headers">
                Local
            </Col>
            <Col md={1} className="remote-comparison-headers">
                Branch
            </Col>
            <Col md={1} className="remote-comparison-headers">
                Remote
            </Col>
            <Col className="remote-comparison-headers">
                Latest Remote Commit
            </Col>
            <Col md={1} className="remote-comparison-headers">
            </Col>
        </Row>
        {branch_comp}
    </Col>)
}

export const AreSynched = (local, remote) => {
    if(!local.branches && !remote.branches) return true
    if(!local.branches || !remote.branches) return false
    if(local.branches.length != remote.branches.length) return false
    for(var i = 0; i<local.branches.length; i++){
        let rem = _containsBranch(local.branches[i].branch, remote.branches)
        if(rem === false) return false
        let remb = remote.branches[rem]
        if(remb.head != local.branches[i].head) return false;
    }
    return true;
}


export const BranchComparison = ({branch, local, remote, repo, onPush, onPull}) => {
    let local_ts, remote_ts, canpull, canpush, local_status, remote_status
    if(local){
        local_ts = printts(local.updated, DATETIME_COMPLETE) 
    }
    else {
        local_status = "missing"
        remote_status = "ok"
        local_ts = ""
    }
    if(remote){
        remote_ts = printts(remote.updated, DATETIME_COMPLETE) 
    }
    else {
        remote_status = "missing"
        local_status = "ok"
        remote_ts = ""
    }
    if(!remote){
        canpull = false
        canpush = "push new branch " + branch + " to remote"
    }
    else if(!local){
        canpull = "pull new branch " + branch + " from remote"
        canpush = false
    }
    else {
        if(remote.head == local.head){
            canpull = false
            canpush = false
            local_status = "ok"
            remote_status = "ok"
        }
        else if(remote.updated > local.updated){
            canpull = "remote has been updated more recently than local"
            canpush = false
            local_status = "behind"
            remote_status = "ahead"
        }
        else {
            canpull = "local has been updated more recently than remote"
            canpush = "local has been updated more recently than remote"            
            local_status = "ahead"
            remote_status = "behind"
        }
    }

    function doPush(){
        repo.local_status = local_status
        repo.remote_status = remote_status
        if(onPush) return onPush(branch, branch, repo)
    }

    function doPull(){
        repo.local_status = local_status
        repo.remote_status = remote_status
        if(onPull) return onPull(branch, branch, repo)
    }

    return(
        <Row className="remote-comparison-spacing">
        <Col md={1}>
            {canpull && 
                <span onClick={doPull}>
                    <PullControl title={canpull} />
                </span>
            }
        </Col>
        <Col>
            {local_ts}
        </Col>
        <Col md={1}>
            <BranchStatus status={local_status} type="local" branch={branch} />
        </Col>
        <Col md={1}>
            <span className="branch-comparison-name">{branch}</span>
        </Col>
        <Col md={1}>
            <BranchStatus status={remote_status} type="remote" branch={branch} />
        </Col>
        <Col>
            {remote_ts}
        </Col>
        <Col md={1}>   
            {canpush && 
                <span onClick={doPush}>
                    <PushControl title={canpush} />
                </span>
            }
       </Col>
    </Row>)

}

export const UnknownComparison = ({branch, local, repo, onPull, onPush}) => {
    
    function doPush(){
        if(onPush) return onPush(branch, branch, repo)
    }

    function doPull(){
        if(onPull) return onPull(branch, branch, repo)
    }

    let canpull = false
    let canpush = false

    return (
        <Row className="remote-comparison-spacing">
        <Col md={1}>
            {canpull && 
                <span onClick={doPull}>
                    <PullControl title={canpull} />
                </span>
            }
        </Col>
        <Col>
            {printts(local.updated, DATETIME_COMPLETE)}
        </Col>
        <Col md={1}>
            <AllGoodBranch type="local" branch={branch}/>
        </Col>
        <Col className="branch-comparison-col" md={1}>
            <span className="branch-comparison-name">{branch}</span>
        </Col>
        <Col md={1}>
            <UnknownBranch type="remote" branch={branch}/>
        </Col>
        <Col>            
        </Col>
        <Col md={1}>
            {canpush && 
                <span onClick={doPush}>
                    <PushControl title={canpush} />
                </span>
            }
       </Col>
    </Row>
    )    
}


export const BranchStatus = ({status, type, branch}) => {
    if(status == "behind") return (<BehindBranch type={type} branch={branch}/>)
    else if(status == "ahead") return (<AheadBranch type={type} branch={branch}/>)
    else if(status == "ok") return (<AllGoodBranch  type={type} branch={branch} />)
    else if(status == "missing") return (<MissingBranch type={type} branch={branch} />)
    else return (<UnknownBranch type={type} branch={branch} />)
}

export const BehindBranch = ({type, branch}) => {
    let title = `${type} ${branch} is behind`
    return <AiOutlineDown title={title} className='branch-status-badge' />
}

export const AheadBranch = ({type, branch}) => {
    let title = `${type} ${branch} is ahead`
    return <AiOutlineUp title={title} className='branch-status-badge' />
}

export const MissingBranch = ({type, branch}) => {
    let title = `${type} ${branch} is missing`
    return (
        <AiOutlineExclamation title={title} className='branch-status-badge' />
    )
}

export const AllGoodBranch = ({type, branch}) => {
    let title = `${type} ${branch} is up to date`
    return (
        <span className="remote-comparison-headers">
            <AiOutlineCheck title={title} className='branch-status-badge' />
        </span>
    )
}

export const UnknownBranch = ({type, branch}) => {
    let title = `${type} is not known to have branch ${branch}`
    return <AiOutlineQuestion title={title} className='branch-status-badge'/>
}

export const PushControl = ({title}) => {
    return (
        <span className="remote-comparison-action">
            push <AiOutlineCloudUpload title={title} className='branch-update-action' />
        </span>
    )
}

export const PullControl = ({title}) => {
    return (
        <span className="remote-comparison-action">
            <AiOutlineCloudDownload title={title} className='branch-update-action' /> pull 
        </span>
    )
}

