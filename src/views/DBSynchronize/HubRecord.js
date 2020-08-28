import React, {useState} from 'react'
import Loading from '../../components/Reports/Loading'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {
    TERMINUS_SUCCESS,
    TERMINUS_INFO,
    TERMINUS_ERROR,
    TERMINUS_WARNING,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import { goDBHome } from '../../components/Router/ConsoleRouter'
import {useAuth0} from '../../react-auth0-spa'
import { CreateLocal, CreateRemote, ShareLocal } from '../../components/Query/CollaborateAPI'
import { TerminusDBSpeaks } from '../../components/Reports/TerminusDBSpeaks'
import {DBHubHeader, DBCreateCard} from "../CreateDB/DBCreateCard"
import { GRAPHDB } from "../../constants/images"
import {Row, Col} from "reactstrap"
import { printts } from "../../constants/dates"
import { DATETIME_COMPLETE } from "../../constants/dates"
import { AiFillEdit, AiFillCopy, AiOutlineBlock, AiFillLock, AiOutlineUser, AiOutlineWarning,
    AiOutlineGlobal, AiOutlineLink} from 'react-icons/ai';
import { validURL } from '../../utils/helperFunctions'
import { MdRefresh } from 'react-icons/md';
import { RiDeleteBin5Line, RiErrorWarningLine } from 'react-icons/ri'
import { CloneLocal } from "../CreateDB/CloneDatabase"

export const HubRecord = ({meta}) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState()
    const {woqlClient, remoteClient, bffClient, refreshDBRecord } = WOQLClientObj()
    let user = woqlClient.user()

    return (
        <div className="tdb__loading__parent">
            <DBHubHeader />
            <HubDBCard meta={meta.remote_record} localClient={woqlClient}/>
            {loading &&  <Loading type={TERMINUS_COMPONENT} />}
        </div>
    )

}


export const HubDBCard = ({meta, onFetch, onDelete, localClient, onRefresh}) => {

    function onClone(){}
    function toggle(){}



    return (
        <Col>
            <Row className='database-summary-listing'>
                <Col md={2} className='database-control-panel database-control-panel-border'>
                    <HubControlPanel
                        meta={meta}
                        onFetch={onFetch}
                        onDelete={onDelete}
                        onRefresh={onRefresh}
                    />
                </Col>
                <Col md={10} className='database-main-content'>
                    <Row>
                        <HubTitle meta={meta}/>
                    </Row>
                    <Row>
                        <HubCredits
                            meta={meta}
                        />
                    </Row>
                </Col>
            </Row>
            <Row>
                <HubDescription
                    meta={meta}
                />
            </Row>
            <Row>
                <CloneLocal onClone={onClone} meta={meta} onCancel={toggle} woqlClient={localClient}/>
            </Row>
            <Row>
                <ForkHub meta={meta} />
            </Row>
        </Col>
    )
}

export const ForkHub = ({meta}) => {
    const {bffClient } = WOQLClientObj()

    let u = bffClient.user()
    return (<DBCreateCard start={meta} organizations={u.organizations} databases={bffClient.databases()}  type="fork" />)
}


export const HubControlPanel = ({meta, onFetch, onDelete, onRefresh}) => {

    let disp = []
    let icon = meta.icon
    if(!icon) icon = GRAPHDB
    if(icon){
        if(validURL(icon)) disp.push(<img className='database-listing-image' src={icon} key="xx1"  />)
        else disp.push(<i key="xx2" className={'database-listing-icon ' + icon} />)
    }

    return (
        <div>
            <Row className="database-left-img">
                {disp}
            </Row>
            <Row className="db-controls">
                <HubControls
                    meta={meta}
                    onRefresh={onRefresh}
                    onDelete={onDelete}
                />
            </Row>
        </div>
    )
}


//Left column - control widget
export const HubControls = ({meta, onRefresh, onDelete}) => {
    let can_edit = true
    return (
        <Row className='major-database-controls'>
            <span className='major-database-controls-align'>
                <span className='refresh-control' onClick={onRefresh}>
                    <RefreshControl meta={meta} />
                </span>
                {can_edit && <>
                    <span className='delete-control' onClick={onDelete}>
                        <DeleteControl meta={meta} />
                    </span>
                    <span className='edit-control' onClick={onDelete}>
                        <EditControl meta={meta} />
                    </span>
                </>}
            </span>
        </Row>
    )
}

export const RefreshControl = ({meta}) => {
    let title = `Refresh Record of ${meta.label} from Terminus Hub`
    return <span className="db-action"  title={title}><MdRefresh color="#0055bb" className='db-control' /></span>
}

export const EditControl = ({meta}) => {
    let title = `Edit metadata for Hub Database ${meta.label}`
    return <span className="db-action"  title={title}><AiFillCopy color="#0055bb" className='db-control' /></span>
}


export const DeleteControl = ({meta}) => {
    let title = `Delete Hub Database ${meta.label}`
    return <span className="db-action"  title={title}><RiDeleteBin5Line color="#721c24" className='db-control' /></span>
}

export const DBWarningCredits = ({text}) => {
    return (
        <span>
            <AiOutlineWarning title="Warning" className="db_info_icon_spacing"/>
            <span className="db_info">{text}</span>
        </span>
    )
}


//Title & remote metadata

export const HubTitle = ({meta}) => {
    let title_css = "database-title-remote"
    let str = (meta && meta.label ? meta.label : meta.id)
    return (
        <span className='database-listing-title-row'>
            <span className={title_css + " database-listing-title"}>{str}</span>
        </span>
    )
}

export const HubCredits = ({meta}) => {
    let res = []
    res.push(<DBProductionCredits  key='ac' meta={meta} />)
    res.push(<DBRoleCredits key='ad' meta={meta} />)
    res.push(<DBLastCommit key='gd' meta={meta} />)
    return (
        <div className="database-listing-title-row">
            {res}
        </div>
    )
}

/*

export const DBRemoteURL = ({url}) => {
    return(<span>
        <AiOutlineLink className="db_info_icon_spacing"/>
        <span className="db_info">{url}</span>
    </span>)
}*/


export const DBLastCommit = ({meta}) => {
    let ts = meta.updated
    if(!ts) return null
    let ct = "Latest Update: " + printts(ts, DATETIME_COMPLETE)
    if(meta.branches && meta.branches.length > 1){
        meta.branches.map((item) => {
            if(item.updated == meta.updated) ct += " on branch " + item.branch
        })
    }
    if(meta.author) ct += " by " + meta.author
    return (
        <div>
            <AiFillEdit className="db_info_icon_spacing"/>
            <span className="db_info">{ct}</span>
        </div>
    )
}

export const DBProductionCredits = ({meta}) => {
    if(meta){
        var tit = (meta.organization_type ? meta.organization_type + " Organization " + meta.organization : "")
        let txt = (meta.organization_label ? meta.organization_label  : meta.organization)
        let icon = (meta.organization_icon ? (<img className="database-listing-organization-icon" src={meta.organization_icon}></img>) : "")
        return (
            <span title={tit}>
                <AiOutlineUser className="db_info_icon_spacing"/>
                <span className="db_info">Publisher: {icon} {txt}</span>
            </span>
        )
    }
    return null
}


function _get_role_title(id, orgtype){
    let map = {
        "create": "Owner",
        "manage": "Manager",
        "write": "Contributor",
        "read": "Reader",
        "monitor": "Monitor"
    }
    return map[id] || "?"
}

export const DBRoleCredits = ({meta}) => {
    if(meta){
        let dbrec = meta
        let rs = [];
        if(dbrec.roles){
            for(var i = 0 ; i<dbrec.roles.length; i++){
                rs.push(_get_role_title(dbrec.roles[i]))
            }
        }
        if(dbrec.public){
            if(rs.length == 0) rs.push("Public")
            return (
                <span>
                    <AiOutlineGlobal title="Public Database" className="db_info_icon_spacing"/>
                    <span className="db_info">{rs}</span>
                </span>
            )
        }
        if(rs.length == 0) rs.push("No Access")
        return (
            <span>
                <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
                <span className="db_info">{rs}</span>
            </span>
        )
    }
    return null
}



export const HubDescription = ({meta}) => {
    let str = meta.comment || ""
    return (
        <Row key='z' className='database-listing-description-row'>
            <span className="database-listing-description">{str}</span>
        </Row>
    )
}
