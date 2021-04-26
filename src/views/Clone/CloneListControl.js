import React, {useEffect, useState,Fragment} from 'react'
import {TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import {CreateRemoteForm} from "../CreateDB/CreateDatabase"
import { AiOutlineStar, AiFillLock, AiOutlineFork, AiOutlineCloudDownload, AiOutlineCheckCircle, AiFillStar,
    AiFillCrown, AiFillEdit, AiOutlineThunderbolt, AiOutlineLink,
    AiOutlineMail, AiOutlineUser, AiOutlineInbox,  AiOutlineGlobal, AiOutlineBell, AiOutlineCloudSync,
    AiOutlineBranches, AiOutlineSchedule, AiOutlineDelete, AiOutlineWarning, AiOutlineCloud, AiOutlineLogin, AiFillWarning, AiOutlinePlus, AiOutlineQuestion, AiOutlineQuestionCircle} from 'react-icons/ai';
import {goDBHome, goHubPage} from "../../components/Router/ConsoleRouter"
import Select from "react-select"
import {Row ,Container} from "react-bootstrap"
import {_filter_list,_sort_list,_get_pp_stats} from "./cloneUtils"
import {WOQLClientObj} from '../../init/woql-client-instance'
import { validURL } from '../../utils/helperFunctions';
//remove moment 
import moment from 'moment';
import { DATETIME_DB_UPDATED } from "../../constants/dates"
import { printts } from "../../constants/dates"


//I copy all in this file from clonePage
//we have to review this components
//They can not stay in the some file
export const CloneListControl = ({list, onAction, organization, sort, filter, showingMine, report}) => {
    if(!list) return null
    const [listSort, setSort] = useState(sort || "updated")
    const [listFilter, setFilter] = useState(filter || "")
    const [sorted, setSorted] = useState()
    const [showingCreate, setShowingCreate] = useState(false)

    useEffect(() => {
        if(listSort && list){
            let filt = _filter_list(list, listFilter)
            setSorted(_sort_list(filt, listSort))
        }
    }, [listSort, listFilter])

    useEffect(() => {
        let filt = _filter_list(list, listFilter)
        if(listSort){
            setSorted(_sort_list(filt, listSort))
        }
        else {
            setSorted(list)
        }
    }, [list])

    function callSort(nsort){
        setSort(nsort.value)
    }

    function showCreate(){
        setShowingCreate(true)
    }

    function unshowCreate(){
        setShowingCreate(false)
    }

    if(!sorted) return null
    let show_create = (!organization && showingMine);
    if(showingCreate) return (<CreateRemoteForm onCancel={unshowCreate}/>)
    return (<>
        <div className="dbclone-filters">
            {(sorted.length == 0 ) &&
                <EmptyCloneList showingMine={showingMine} organization={organization}/>
            }
            {sorted.length > 0 &&
                <CloneListStats showingMine={showingMine} organization={organization} list={sorted} />
            }
            {show_create &&
                <CreateHubDB onCreate={showCreate} />
            }
            { false &&
                <ListFilter filter={listFilter} onChange={callFilter} />
            }
            {list.length > 1 &&
                <ListSorter sort={listSort} onChange={callSort} organization={organization} />
            }
        </div>
        <Row className="generic-message-holder">
            {report &&
                <TerminusDBSpeaks report={report} />
            }
        </Row>
        <CloneList list={sorted} onAction={onAction}/>
  </>)
}

export const EmptyCloneList = ({showingMine, organization}) => {
    if(!organization && showingMine){
        return <EmptyMyDBs />
    }
    else if(!organization){
        return <EmptyCollaborations />
    }
    else if(organization == "invitations"){
        return <EmptyInvitations />
    }
    else if(organization == "recommendations"){
        return <EmptyRecommendations />
    }
    else {
        return <EmptyPublisher publisher={organization} />
    }
}


export const EmptyMyDBs = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiOutlineCloud className="empty-clonelist-icon"/> There are no databases saved in your TerminusHub Account
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />  To save databases to your TerminusHub account, either:
                <CreateDBOption />
                <SaveDBOption />
                <ForkDBOption />
        </span>
    </span>
}

export const EmptyInvitations = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiOutlineMail className="empty-clonelist-icon"/> There are no pending invitations
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />
            Other TerminusHub users can invite you to view or collaborate their published databases. When you recieve an invitation, you can view it here
        </span>
    </span>
}

export const EmptyCollaborations = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiOutlineLogin className="empty-clonelist-icon"/> You are not a collaborator on any TerminusHub Databases
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />
            Other TerminusHub users can make you a collaborator on their databases. When you are given collaborator rights to other people's databases, you can access them here
        </span>
    </span>
}

export const EmptyRecommendations = () => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiFillWarning className="empty-clonelist-icon"/> There are currently no recommendations available
        </span>
        <span className="empty-clonelist-help">
            <AiOutlineQuestionCircle className="clonelist-help-icon" />
            This normally means that there is some communication problem between your local server and TerminusHub. Try pressing Ctrl-R or refreshing your browser
            to reconnect to TerminusHub
        </span>
    </span>
}


export const EmptyPublisher = ({publisher}) => {
    return <span className="empty-clonelist">
        <span className="empty-clonelist-title">
            <AiFillWarning className="empty-clonelist-icon"/> There are currently no database available from publisher {publisher}
        </span>
    </span>
}

export const CloneListStats = ({showingMine, organization, list}) => {
    if(!organization && showingMine){
        return <MyDBStats list={list} />
    }
    else if(!organization){
        return <CollaboratorStats list={list} />
    }
    else if(organization == "invitations"){
        return <InvitationStats />
    }
    else if(organization == "recommendations"){
        return <RecommendationStats />
    }
    else {
        return <OrgDBStats list={list} organization={organization} />
    }
}

export const MyDBStats = ({list}) => {
    let stats = _get_pp_stats(list)
    let dbname = stats.total == 1 ? "Database" : "Databases"

    return <span className="stats-list-intro">Your Account Has:
        <span className="db-card-credit">
            <AiOutlineCloud className="db_info_icon_spacing"/>
            <span className="db_info">{stats.total} {dbname}</span>
        </span>
        <PPStats pub={stats.public} pri={stats.private} />
    </span>
}


export const CollaboratorStats = ({list}) => {
    let stats = _get_pp_stats(list)
    let dbname = stats.total == 1 ? "Database" : "Databases"
    return <span className="stats-list-intro">You are a collaborator on:
        <span className="db-card-credit">
            <AiOutlineLogin className="db_info_icon_spacing"/>
            <span className="db_info">{stats.total} {dbname}</span>
        </span>
        <PPStats pub={stats.public} pri={stats.private} />
    </span>
}

export const PPStats = ({pub, pri}) => {
    return <span className="db-privacy-stats">
        <span className="db-card-credit">
            <AiOutlineGlobal title="Public Databases" className="db_info_icon_spacing"/>
            <span className="db_info">{pub} Public</span>
        </span>
        <span className="db-card-credit" >
            <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
            <span className="db_info">{pri} Private</span>
        </span>
    </span>
}

export const InvitationStats = () => {
    return <span className="stats-list">
        <AiOutlineMail className="hub-active-icon active-star hub-bar-spacing"/> Invitations to collaborate from other users
    </span>
}

export const RecommendationStats = () => {
    return <span className="stats-list-intro">
        <AiOutlineStar className="hub-active-icon active-star hub-bar-spacing"/> <strong>Recommendations</strong> Useful and Interesting Databases that you can clone to help you get up and running with TerminusDB
    </span>
}

export const OrgDBStats = ({list, organization}) => {
    let stats = _get_pp_stats(list)
    let nm = organization
    let dbname = stats.total == 1 ? "Database" : "Databases"
    return <span className="stats-list-intro">Available from {nm} :
        <span className="db-card-credit">
            <AiOutlineCloud className="db_info_icon_spacing"/>
            <span className="db_info">{stats.total} {dbname}</span>
        </span>
        <PPStats pub={stats.public} pri={stats.private} />
    </span>
}


export const CreateHubDB = ({onCreate}) => {
    let txt = "New TerminusHub Database"
    let title = "Create a new database on TerminusHub"
    return (
        <button title={title} type="submit" className="dblist-create" onClick={onCreate}>
            {txt} <AiOutlinePlus className="create-btn-icon" />
        </button>
    )
}

export const ListFilter = ({filter, onChange, organization}) => {
    if(organization == "invitations") return <InvitationFilter filter={filter} onChange={onChange}/>
    let filters = [
        {value: "", label: "Show all"},
        {value: "public", label: "Public Databases"},
        {value: "private", label: "Private Databases"},
        {value: "local", label: "Databases I have locally"},
        {value: "hub", label: "Databases I don't have locally"},
        {value: "unsynched", label: "Need Synchronisation"}
    ]

    let ph = ""
    for(var i = 0; i<filters.length; i++){
        if(filters[i].value == filter) ph += filters[i].label
    }

    return (
        <Select
            options={filters}
            placeholder = {ph}
            defaultValue= {filter}
            onChange={onChange}
        />
    )
}

export const ListSorter = ({sort, onChange, organization}) => {
    sort = sort || "updated"
    let sort_algos = [
        {value: "updated", label: "Most Recently Updated First"},
        {value: "oldest", label: "Least Recently Updated First"},
        {value: "created", label: "Newest Database First"},
        {value: "name", label: "Database Name (A-Z)"},
        //{value: "organization", label: "Publisher"},
    ]

    if(organization && (organization == "invitations" ||  organization == "recommendations")){
        return null
    }

    let ph = ""
    for(var i = 0; i<sort_algos.length; i++){
        if(sort_algos[i].value == sort) ph += sort_algos[i].label
    }

    return (
        <Select
            className="dblist-filter"
            options={sort_algos}
            placeholder = {ph}
            defaultValue= {sort}
            onChange ={onChange}
        />)
}

export const CreateDBOption = () => {
    return <span className="empty-clonelist-option">
        <AiOutlinePlus className='clonelist-option-icon'/> <span className="empty-action-title"> Create on Hub</span>
        <span className="empty-action-explanation"> Create a new database directly on TerminusHub</span>
    </span>
}

export const SaveDBOption = () => {
    return <span className="empty-clonelist-option">
        <AiOutlineCloudSync className='clonelist-option-icon'/> <span className="empty-action-title"> Save to Hub</span>
        <span className="empty-action-explanation"> Save to TerminusHub from the synchronize screen</span>
    </span>
}

export const ForkDBOption = () => {
    return <span className="empty-clonelist-option">
         <AiOutlineFork className='clonelist-option-icon'/> <span className="empty-action-title"> Fork from Hub</span>
        <span className="empty-action-explanation"> Copy another TerminusHub Database to your Account</span>
    </span>
}

export const InvitationFilter = ({filter, onChange}) => {
    let filters = [
        {value: "", label: "Pending Invitations"},
        {value: "accepted", label: "Accepted Invitations"},
        {value: "rejected", label: "Rejected Invitations"},
    ]
    let ph = ""
    for(var i = 0; i<filters.length; i++){
        if(filters[i].value == filter) ph += filters[i].label
    }
    return (
        <Select
            options={filters}
            placeholder = {ph}
            defaultValue= {filter}
            onChange={onChange}
        />)
}

export const CloneList = ({list, onAction}) => {
    if(!list.length){
        return null
    }
    return (
        <Container fluid>
            {list.map((value, index) => {
                return (<CloneSummaryCard key={"sum_" + index} meta={value} onAction={onAction}/>)
            })}
        </Container>
    )
}

export const DBBranches = ({meta, type}) => {
    type = type || "summary"
    let word = (meta.branches && meta.branches.length == 1 ? "branch" : "branches")
    if(meta.branches && meta.branches.length > 1) {
        let text = meta.branches.length + (type == "full" ? " " + word : "")
        return (
            <span className="db-card-credit" title={meta.branches.length + " " + word}>
                <AiOutlineBranches className="db_info_icon_spacing"/>
                <span className="db_info">
                    {text}
                </span>
            </span>
        )
    }
    return false
}

export const CloneCredits = ({meta, onAction}) => {
    let res = []
    res.push (
        <CloneProductionCredits  key='ac' meta={meta} onAction={onAction}/>
    )
    res.push(
        <DBPrivacy key='ad' meta={meta} />
    )
    res.push(
        <CloneRoleCredits key='ade' meta={meta} />
    )
    //res.push(<CloneURLCredit key="cuc" meta={meta} />)
    if(meta && (meta.created || meta.updated)) {
        res.push(<DBTimings key='dbt' meta={meta} />)
    }
    if(meta.branches && meta.branches.length > 1) {
        res.push(
            <DBBranches key='abc' meta={meta} />
        )
    }
    return (
        <div className="database-listing-title-row">
            {res}
        </div>
    )
}

export const CloneSummaryCard = ({meta, onAction}) => {
    return (
        <Row key='r7' className='database-summary-listing database-listing-line'>
            <CloneImagePanel meta={meta} onAction={onAction} />
            <span className='database-main-content'>
                <Row key='r3'>
                    <CloneTitle meta={meta} onAction={onAction}/>
                </Row>
                <CloneCredits meta={meta} onAction={onAction}/>
                <CloneDescription meta={meta} />
                {meta.invitation_id &&
                    <Row key='r9'>
                        <DBInvite meta={meta}/>
                    </Row>
                }
            </span>
            <span className='database-main-actions'>
                <CloneStatus meta={meta} onAction={onAction}/>
            </span>
        </Row>
    )
}


export const CloneImagePanel = ({meta, onAction}) => {
    let icon = meta.icon
    let goDB = onAction ? function(){
        meta.action = "load"
        onAction(meta)
        goHubPage(meta.organization, meta.id)
    } : undefined

    let clickcss = onAction ? " clickable-image-panel" : ""

    if(!icon) {
        if(meta.organization_icon) icon = meta.organization_icon
        else icon = HUBDB
    }
    let title = `Database ${meta.id} in organization ${meta.organization}`
    let vi = validURL(icon)
    return (
        <span title={title} className={'dbcard-control-panel' + clickcss} onClick={goDB} >
        {vi &&
            <img className='dbcard-image' src={icon}/>
        }
        {!vi &&
            <i className={'dbcard-icon ' + icon} />
        }
        </span>
    )
}


export const CloneTitle = ({meta, onAction}) => {

    function goDB(){
        meta.action = "load"
        onAction(meta)
        goHubPage(meta.organization, meta.id)
    }

    let title_css = "database-title-local"
    let str = meta.label || '['+ meta.id+']'

    return (
        <span>
            <span onClick={goDB} className='database-listing-title-row'>
                <span key='a' className={title_css + " database-listing-title"}>{str}</span>
            </span>
        </span>
    )
}

export const CloneDescription = ({meta}) => {
    let str = meta.comment || ""
    let title = str;
    if(str && str.length > 400){
        str =  meta.comment.substring(0, 396) + " ..."
    }
    if(str){
        return (
            <Row key='z' title={title} className='database-listing-description-row'>
                <span className="database-listing-description">{str}</span>
            </Row>
        )
    }
    return null
}

export const CloneStatus = ({meta, onAction}) => {
    if(meta.invitation_id){
        console.log(meta)
        return (
            <div className='database-action-column'>
                <Row className='database-update-status'>
                    <RemoteUpdated meta={meta} />
                </Row>
                <Row className='database-secondary-option'>
                    <CloneSecondaryAction meta={meta} onAction={onAction}/>
                </Row>
            </div>
        )
    }
    else {
        return (
            <div className='database-action-column'>
                <div className="hub-minor-actions">
                </div>
                <div className="hub-major-actions">
                    <CloneMainAction meta={meta} onAction={onAction}/>
                </div>
            </div>
        )
    }
}

export const CloneMainAction = ({meta, onAction}) => {
    const {remoteClient } = WOQLClientObj()
    if(!remoteClient) return null
    let rurl = remoteClient.server() + meta.organization + "/" + meta.id
    let onc = function(){
        let myc = {
            id: meta.id,
            label: meta.label,
            comment: meta.comment,
            remote_url: rurl,
            remote_record: meta,
            auto: true,
        }
        myc.action = "clone"
        onAction(myc)
    }
    if(meta.public || meta.roles){
        return (
            <span className="database-clone-action" onClick={onc}>
                <CloneControl meta={meta} />
            </span>
        )
    }
    return false
}

export const CloneSecondaryAction = ({meta, onAction}) => {

    function myReject(){
        meta.action = 'reject'
        if(onAction) onAction(meta)
    }

    function myAccept(){
        meta.action = 'accept'
        if(onAction) onAction(meta)
    }

    return (
        <div className="action-centralise">
            <div>
                <span onClick={myAccept} className='invite-main-action'>
                    <AcceptControl meta={meta} />
                </span>
                <span className = 'invite-main-action' onClick={myReject}>
                    <RejectControl meta={meta} />
                </span>
            </div>
        </div>
    )
    return null
}

export const CloneControl = () => {
    return <AiOutlineCloudDownload className="hub-main-action-icon clone-main-action-icon" title="Clone this database now"/>
}

export const CloneFullControl = () => {
    return <span className="clone-full-action">
        <span className="clone-full-title-bar">
            <AiOutlineCloudDownload className="clone-full-icon" title="Clone Database"/>
            <span className="clone-full-title">Clone</span>
         </span>
         <span className="clone-full-descr">download a local copy</span>
    </span>
}

export const CloneURLCredit = ({meta}) => {
    const { remoteClient } = WOQLClientObj()
    let url = remoteClient.server() + meta.organization + "/" + meta.id
    return(<span className="db-card-credit">
        <AiOutlineLink className="db_info_icon_spacing"/>
        <span className="db_info db-card-url">{url}</span>
    </span>)
}

export const CloneProductionCredits = ({meta, onAction, type}) => {
    var tit = (meta.organization_type ? meta.organization_type + " Organization " + meta.organization : "")
    let txt = meta.organization_label || meta.organization
    if(type == "full") txt += " " + tit
    function goDB(){
        if(onAction) onAction({action: "load", organization: meta.organization})
        else goHubPage(meta.organization)
    }
    let icon = (meta.organization_icon ? (<img className="database-listing-organization-icon" src={meta.organization_icon}></img>) : "")

    return (
        <span className="db-card-credit hub-organization-link" title={tit} onClick={goDB}>
            <AiOutlineUser className="db_info_icon_spacing"/>
            <span className="db_info">
                <span className="db-card-label">
                    Publisher
                </span> {icon} <span className="db-card-orgname">{txt}</span>
            </span>
        </span>
    )
}

export const DBPrivacy = ({meta}) => {
    if(meta.public) {
        return (
            <span className="db-card-credit">
                <AiOutlineGlobal title="Public Database" className="db_info_icon_spacing"/>
                <span className="db_info">Public</span>
            </span>
        )
    }
    else {
        return (
            <span className="db-card-credit" >
                <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
                <span className="db_info">Private</span>
            </span>
        )
    }
}

export const CloneRoleCredits = ({meta}) => {
    let rs = []
    function _get_role_title(id){
        let map = {
            "create": "Owner",
            "manage": "Manager",
            "write": "Contributor",
            "read": "Reader",
            "monitor": "Monitor"
        }
        return map[id] || "?"
    }

    if(meta.roles){
        for(var i = 0 ; i<meta.roles.length; i++){
            rs.push(_get_role_title(meta.roles[i]))
        }
    }
    if(meta.public && rs.length == 0) return null;
    if(rs.length >= 1){
        return (
            <span className="db-card-credit" >
                <AiFillCrown title="Database Roles" className="db_info_icon_spacing"/>
                <span className="db_info">{rs}</span>
            </span>
        )
    }
    return (
        <span className="db-card-credit" >
            <AiFillLock title="No Access" className="db_info_icon_spacing"/>
            <span className="db_info">No Access</span>
        </span>
    )
}

export const DBTimings = ({meta}) => {
    let parts = []
    function updateStamp(ts){
        //set to now, but with 0 mins, 0 secs, and 0 ms
        let lab = moment(ts*1000).startOf('hour').fromNow()
        return lab
    }

    if(meta.created && meta.updated && (meta.created == meta.updated)){
        let cts = updateStamp(meta.created, true)
        parts.push(<DBCreated key='xss' display={cts} ts={meta.created}/>)
    }
    else {
        if(meta.created){
            let cats = updateStamp(meta.created, !meta.updated)
            parts.push(<DBCreated key='ds' display={cats} ts={meta.created} />)
        }
        if(meta.updated){
            let uts = updateStamp(meta.updated, true)
            if(meta.author) uts += " by " + meta.author
            parts.push(<DBUpdated key='dbu' author={meta.author} display={uts} ts={meta.updated}/>)
        }
    }
    return parts
}

export const DBCreated = ({display, ts, author}) => {
    if(!ts) return null
    let ct = "First Commit " + printts(ts, DATETIME_DB_UPDATED)
    if(author) ct += " by " + author
    return (
        <span className="db-card-credit" title={ct}>
            <AiOutlineBell className="db_info_icon_spacing"/>
            {display &&
                <span className="db_info">{display}</span>
            }
            {!display &&
                <span className="db_info">
                    <span className="db-card-label">First Commit </span>
                    <span className="db-card-date">{printts(ts, DATETIME_DB_UPDATED)}</span>
                    {author &&
                        <span className="db-card-author">
                            <span className="db-card-label"> by </span>
                            <span className="db-card-email">{author}</span>
                        </span>
                    }
                </span>
            }
        </span>
    )
}

export const DBUpdated = ({display, ts, author}) => {
    if(!ts) return null
    let ct = "Most Recent Commit " + printts(ts, DATETIME_DB_UPDATED)
    if(author) ct += " by " + author
    return (
        <span className="db-card-credit" title={ct}>
            <AiFillEdit className="db_info_icon_spacing"/>
            {display &&
                <span className="db_info">{display}</span>
            }
            {!display &&
                <span className="db_info">
                    <span className="db-card-label">Most Recent Commit </span>
                    <span className="db-card-date">{printts(ts, DATETIME_DB_UPDATED)}</span>
                    {author &&
                        <span className="db-card-author">
                            <span className="db-card-label"> by </span>
                            <span className="db-card-email">{author}</span>
                        </span>
                    }
                </span>
            }
        </span>
    )
}

