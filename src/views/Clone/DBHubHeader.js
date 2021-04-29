import React , {useState} from 'react'
import { HUBDB } from "../../constants/images"
import {TerminusDBTitle} from "../../constants/labels"
import {Row , Col} from "react-bootstrap" //replace
import {WOQLClientObj} from '../../init/woql-client-instance'
import { AiOutlineStar,AiOutlineMail, AiOutlineUser,
       AiOutlineCloud, AiOutlineLogin} from 'react-icons/ai';
import {FiUsers} from "react-icons/fi"
//To be review the look end fill 
//meta arg declared but never read 
//organization is not the organization name but the action maybe change the variable name
export const DBHubHeader = ({organization, url, onChange, onError}) => {
    //let text = "This database is stored on Terminus Hub"
    return (
        <Row className="remote-info clone-widget-title">
            <div className='remote-info-align database-create-header'>
                <img className='database-header-image' src={HUBDB} title={TerminusDBTitle}  />
                <span className='database-listing-header-row'>
                    <span key='a' className="database-header-title remote-info-label">
                        Terminus Hub Database
                    </span>
                </span>
            </div>
            <div className="database-remote-info-row">
                <HubToolbar onChange={onChange} onError={onError} url={url} organization={organization}/>
            </div>
        </Row>
    )
}

export const CloneHubHeader = ({organization, showingMine, list, onChange, onError}) => {
    //let realorg =  (organization && ["recommendations", "invitations", "collaborators"].indexOf(organization) == -1 ) ? true : false

    return (
        <Row className="remote-info clone-widget-title">
            <div className="remote-info-align database-create-header">
                <img className='database-header-image' src={HUBDB} title={TerminusDBTitle}  />
                <span className='database-listing-header-row'>
                    <span key='a' className="database-header-title remote-info-label">
                        Share, Clone and Collaborate with Terminus Hub
                    </span>
                </span>
            </div>
            <div className="database-remote-info-row">
                <HubToolbar showingMine={showingMine} onChange={onChange} onError={onError} organization={organization}/>
            </div>
    </Row>)
}

export const HubToolbar = ({onChange, showingMine, onError, organization, url}) => {
    const { woqlClient, remoteClient } = WOQLClientObj()

    const [bump, setBump] = useState(0)

    function goInvites(){
        onChange("invitations")
    }

    function goRecommendations(){
        onChange("recommendations")
    }

    function goHome(){
        onChange("")
    }

    function goCollaborators(){
        onChange("collaborators")
    }


    function goCollaborations(){
        onChange("collaborations")
    }

    function doURLTry(u){
        if(!validURL(u)){
            return alert("Not a valid URL")
        }
        if(isLocalURL(u, woqlClient)){
            let did = u.substring(u.lastIndexOf("/")+1)
            let ded = woqlClient.databaseInfo(did, woqlClient.user_organization())
            if(ded){
                goDBHome(ded, woqlClient.user_organization())
            }
            else {
                onError(404, `Local database ${u} does not exist`)
            }
        }
        else if(isLocalURL(u, remoteClient)){
            let bits = u.split("/")
            let did = bits[bits.length-1]
            let oid = bits[bits.length-2]
            onChange(oid, did)
        }
        else {
            //onChange("clone", url)
        }
    }

    let u = woqlClient.user()

    return (
        <Row className="hub-toolbar">
            {u.logged_in && <>
                <Col className="hub-home-col hub-recommendations-col" md={1.5}>
                    <MyDatabasesLinker showingMine={showingMine} bump={bump} organization={organization} onSubmit={goHome}/>
                </Col>
                <Col className="hub-toolbar-col hub-collaborations-col" md={1.5}>
                    <CollaborationsLinker showingMine={showingMine} bump={bump} organization={organization} onSubmit={goCollaborations}/>
                </Col>
                <Col className="hub-toolbar-col hub-invitations-col" md={1.5}>
                    <InvitationsLinker bump={bump} organization={organization} onSubmit={goInvites}/>
                </Col>
                <Col className="hub-home-col hub-recommendations-col" md={1.5}>
                    <CollaboratorsLinker  bump={bump} organization={organization} onSubmit={goCollaborators}/>
                </Col>
            </>}
            <Col className="hub-toolbar-col hub-recommendations-col" md={1.5}>
                <RecommendationsLinker  bump={bump} organization={organization} onSubmit={goRecommendations}/>
            </Col>
            <Col className="hub-toolbar-col publisher-picker-col" md={1}>
                <PublisherPicker onSubmit={onChange} organization={organization} />
            </Col>
        </Row>
    )
}

const InvitationsLinker = ({organization, onSubmit}) => {
    if(organization == "invitations"){
        return(
            <span title="Invitations" className='hub-inputbar hub-active-link'>
                <AiOutlineMail className="hub-active-icon active-mail hub-bar-spacing"/> Invitations
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View Latest Invitations" className='hub-inputbar hub-link'>
            <AiOutlineMail className="hub-inactive-icon inactive-mail hub-bar-spacing"/> Invitations
        </span>
    )
}

const MyDatabasesLinker = ({organization, onSubmit, showingMine}) => {
    if(!organization && showingMine){
        return(
            <span title="My Databases" className='hub-inputbar hub-active-link'>
                <AiOutlineCloud className="hub-active-icon active-cloud hub-bar-spacing"/> My Databases
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View your TerminusHub databases" className='hub-inputbar hub-link'>
            <AiOutlineCloud className="hub-inactive-icon inactive-cloud hub-bar-spacing"/> My Databases
        </span>
    )
}

const CollaborationsLinker = ({organization, onSubmit, showingMine}) => {
    if(!organization && !showingMine){
        return(
            <span title="Collaborations" className='hub-inputbar hub-active-link'>
                <AiOutlineLogin className="hub-active-icon active-mail hub-bar-spacing"/> Collaborations
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View your Collaborations" className='hub-inputbar hub-link'>
            <AiOutlineLogin className="hub-inactive-icon inactive-mail hub-bar-spacing"/> Collaborations
        </span>
    )
}

const CollaboratorsLinker = ({organization, onSubmit}) => {
    if(organization == "collaborators"){
        return(
            <span title="Collaborators" className='hub-inputbar hub-active-link'>
                <FiUsers className="hub-active-icon active-mail hub-bar-spacing"/> Collaborators
            </span>
        )
    }
    return (
        <span onClick={onSubmit} title="View your TerminusHub databases" className='hub-inputbar hub-link'>
            <FiUsers className="hub-inactive-icon inactive-mail hub-bar-spacing"/> Collaborators
        </span>
    )
}

const RecommendationsLinker = ({organization, onSubmit}) => {
    if(organization == "recommendations"){
        return (
            <span title="Recommendations" className='hub-inputbar hub-active-link'>
                <AiOutlineStar className="hub-active-icon active-star hub-bar-spacing"/> Recommendations
            </span>
        )
    }
    return (
        <span  title="View Latest Recommendations" onClick={onSubmit} className='hub-inputbar hub-link'>
            <AiOutlineStar className="hub-inactive-icon inactive-star hub-bar-spacing"/> Recommendations
        </span>
    )
}

const PublisherPicker = ({onSubmit, organization}) => {
    function checkKeys(event){
        if(event.key === "Enter" && event.target.value) {
            onSubmit(event.target.value)
        }
    }

    let ph = "Enter Publisher ID"
    let df = (["recommendations", "invitations", "collaborators"].indexOf(organization) == -1 ) ? organization : null
    return (
        <span className='hub-inputbar publisher-picker'>
            <AiOutlineUser className="hub-bar-spacing"/>
            <input
                type="text"
                defaultValue={df}
                className='publisher-picker-input'
                placeholder={ph}
                onKeyPress={checkKeys}
            />
        </span>
    )
}

/*we not use it
const URLPicker = ({onSubmit, url}) => {
    function checkKeys(event){
        if(event.key === "Enter" && event.target.value && validURL(event.target.value)) onSubmit(event.target.value)
    }
    return (
        <span className='hub-inputbar url-picker'>
            <AiOutlineLink className="hub-bar-spacing"/>
            <input
                type="text"
                defaultValue={url}
                className='url-picker-input'
                placeholder="Enter Database URL"
                onKeyPress={checkKeys}
            />
        </span>
    )
}*/


