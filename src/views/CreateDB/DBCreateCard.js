import React, {useState, useEffect, Fragment} from "react"
import { GRAPHDB, HUBDB } from "../../constants/images"
import {Row, Col, Modal, ModalHeader, ModalBody} from "reactstrap"
import { AiOutlineRead, AiOutlineDown, AiOutlineSchedule, AiFillCheckCircle, AiOutlineThunderbolt,
    AiOutlinePlusCircle, AiOutlineLink, AiFillLock, AiFillInfoCircle, AiOutlineUser, AiOutlineExclamation,
    AiOutlineGlobal, AiOutlineLeft} from 'react-icons/ai';
import { FiDatabase } from "react-icons/fi"
import { validURL } from '../../utils/helperFunctions';
import { legalURLID } from "../../components/Query/CollaborateAPI"
import { IoMdImages } from 'react-icons/io';
import { Pexels } from '../../components/Pexels/Pexels';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import { ICONS_PICKER } from '../../constants/fontawesomepicker'

export const DBCreateHeader = ({local, toggle}) => {
    let local_text = "Create a new database on your local TerminusDB - only accessible locally"
    let remote_text = "Create a new database on Terminus Hub where you can share it with collaborators"
    let text = local ? local_text : remote_text
    let alt_text = local ? remote_text : local_text
    let choice = local ? "Create Local Database" : "Create Database on Terminus Hub"
    let alt_choice = local ? "Create Database on Terminus Hub" : "Create Local Database"
    return ( <>
        <Row className='database-create-header'>
            {/*<Col key='r5' md={1} className='database-create-current'>
                <DBCreatePicture local={local} />
            </Col>*/}
            <Col key='r7' md={9} className='database-create-current'>
                <span className='database-listing-title-row'>
                    <Row  key="rr">
                        <span className="database-header-title">{choice}</span>
                    </Row>
                    <Row key="re">
                        <span className="database-listing-description-header">
                            <AiOutlineRead className="db_info_icon_spacing" color="#787878" style={{"fontSize": "20px"}}/>
                            <span className="database-listing-description ">{text}</span>
                        </span>
                    </Row>
                </span>
            </Col>
            <Col key='r6' md={3} className='database-create-choice' onClick={toggle}>
                <DBCreatePicture local={!local} />
                <span className='database-choice-title'>
                    {alt_choice}
                </span>
            </Col>
        </Row>
    </>
    )
}


export const DBLocalCreateHeader = () => {
    let text = "Create a new database on your local TerminusDB"
    return (
        <Row className='database-create-header'>
            <DBCreatePicture local={true} />
            <span className='database-listing-title-row'>
                <span key='a' className="database-header-title">Create Local Database</span>
                <div key='z' className='database-header-description-row'>
                    <span className="database-listing-description">{text}</span>
                </div>
            </span>
        </Row>
    )
}

export const DBShareHeader = ({onCancel}) => {
    let text = "Share your database on Terminus Hub"
    return (<>
        <div className='remote-info-align database-create-header '>
            <DBCreatePicture local={false} />
            <span className='database-listing-title-row'>
                <span key='a' className="database-header-title remote-info-label">Share Database</span>
            </span>
        </div>
            <div className="database-remote-info-row">
                <div key='z' className='database-header-description-row'>
                    <span className="database-listing-description">{text}</span>
                </div>
            </div> </>

    )
}

export const DBHubHeader = ({onCancel}) => {
    let text = "This is a record of a database stored on Terminus Hub"
    return (
        <Row className='database-create-header'>
            <DBCreatePicture local={false} />
            <span className='database-listing-title-row'>
                <span key='a' className="database-header-title">Terminus Hub Database</span>
                <div key='z' className='database-header-description-row'>
                    <span className="database-listing-description">{text}</span>
                </div>
            </span>
        </Row>
    )
}

export const CloneHubHeader = ({onCancel}) => {
    let text = "You can collaboratively integrate data by cloning and copying databases from Terminus Hub"
    return (
        <Row className='database-create-header'>
            <DBCreatePicture local={false} />
            <span className='database-listing-title-row'>
                <span key='a' className="database-header-title">Terminus Hub Databases</span>
                <div key='z' className='database-header-description-row'>
                    <span className="database-listing-description">{text}</span>
                </div>
            </span>
        </Row>
    )
}


const DBCreatePicture = ({local}) => {
    let ics = []
    let icon = GRAPHDB
    if(!local){
        icon = HUBDB
    }
    let title = (local ? "Local Database" : "Terminus Hub Database")
    if (icon == GRAPHDB)
        ics.push(<FiDatabase title={title} className='database-header-image' className={"db-icon-create"}/>)
    else ics.push(<img className='database-header-image' src={icon} title={title}  />)
    return <>{ics}</>
}


export const DBCreateCard = ({start, databases, organizations, onSubmit, type}) => {

    const [current, setCurrent] = useState(start)

    function changePrivacy(){
        let n = {}
        for(var k in current){
            if(k == 'public'){
                n[k] = !current[k]
            }
            else {
                n[k] = current[k]
            }
        }
        setCurrent(n)
    }

    function changeSchema(){
        let n = {}
        for(var k in current){
            if(k == 'schema'){
                n[k] = !current[k]
            }
            else {
                n[k] = current[k]
            }
        }
        setCurrent(n)
    }

    function changeID(id){
        let n = {}
        for(var k in current){
            if(k == 'id'){
                n[k] = id
            }
            else {
                n[k] = current[k]
            }
        }
        setCurrent(n)
    }

    function changeTitle(tit){
        let n = {}
        for(var k in current){
            if(k == 'label'){
                n[k] = tit
            }
            else {
                n[k] = current[k]
            }
        }
        setCurrent(n)
    }

    function changeIcon(ic){
        let n = {}
        for(var k in current){
            if(k == 'icon'){
                n[k] = ic
            }
            else {
                n[k] = current[k]
            }
        }
        setCurrent(n)
    }

    function changeComment(ic){
        let n = {}
        for(var k in current){
            if(k == 'comment'){
                n[k] = ic
            }
            else {
                n[k] = current[k]
            }
        }
        setCurrent(n)
    }

    function doSubmit(){
        let sub = {}
        sub.id = current.id
        sub.label = current.label
        sub.organization = current.organization
        sub.comment = current.comment || ""
        if(current.public) sub.public = true
        if(current.schema) sub.schema = true
        if(current.icon) sub.icon = current.icon
        onSubmit(sub)
    }

    if(!current) return null

    let isEdit = (type && type == "edit")
    return (<>
        <Row key='r7' className='database-summary-listing'>
            <Col key='r5' md={3} className='database-control-panel'>
                <DBControlPanel meta={current} onChange={changeIcon} />
            </Col>
            <Col md={9} className='database-main-content'>
                <Row className='database-create-title-row db-create-remote-row'>
                    <DBTitle label={current.label} organization={current.organization} onChange={changeTitle} databases={databases}/>
                </Row>
                {!isEdit &&
                    <Row className='database-create-id-row db-create-remote-row'>
                        <DBID id={current.id} organization={current.organization} databases={databases} hub_url={current.hub_url} onChange={changeID} />
                    </Row>
                }
                {!isEdit &&
                    <Row className="database-create-credits db-create-remote-row">
                        <DBCredits meta={current} onIDChange={changeID} onPrivacyChange={changePrivacy} onSchemaChange={changeSchema} isEdit={isEdit}/>
                    </Row>
                }
                <Row className="database-create-decription-row db-create-remote-row">
                    <DBDescription meta={current} onChange={changeComment} />
                </Row>
                <Row className="database-create-status">
                    <DBRequired meta={current} databases={databases} type={type}/>
                </Row>
                <Row className="database-create-exec">
                    <DBCreate meta={current} databases={databases} onSubmit={doSubmit} type={type} />
                </Row>
            </Col>
        </Row>
    </>)
}

export const DBRequired = ({meta, databases, type}) => {
    let p = _problems(meta, databases, type)
    if(p === false){
        return null;
    }
    else {
        return (<span className="db-required-color">
            <AiFillInfoCircle color="#856404" className="db_info_icon_spacing"/> {p}</span>
        )
    }
}

function _problems(meta, databases){
    let a = _validate_id(meta.id, meta.organization, databases)
    let b = _validate_title(meta.label, meta.organization, databases)

    if(a == "empty" && b == "empty"){
        return "ID and title required"
    }
    if(a == "ok" && b == "ok"){
        return false
    }
    else if(a == "empty" && b == "ok"){
        return "ID required"
    }
    else if(a == "ok" && b == "empty"){
        return "Title required"
    }
    else if(a != "ok" && a != "empty" && b != "ok" && b != "empty"){
        return "Fix errors with title and id"
    }
    else if(a != "ok" && a != "empty"){
        return "Fix error with database id"
    }
    else if(b != "ok" && b != "empty"){
        return "Fix error with database title"
    }
}

export const DBCreate = ({meta, databases, onSubmit, type}) => {
    let str = "Create on Terminus Hub"
    if(type && type == "share") str = "Share on Terminus Hub"
    if(type && type == "edit") str = "Update Terminus Hub Database Record"
    if(_problems(meta, databases, type) === false){
        /*return (<span className='database-create-submit database-create-submit-active' onClick={onSubmit}>
            <span className='database-submit-title'>
                {str}
            </span>
        </span>) */
        return (<button type="submit" onClick={onSubmit} className="tdb__button__base tdb__button__base--green">
            <AiOutlinePlusCircle style={{"fontSize": "30px"}} color="fff" className="title-remote-action-icon"/>
            <span className="title-remote-action"> {str} </span>
        </button>)
    }
    else {
        return null;/* (<span className='database-create-submit database-create-submit-inactive' title="complete form to active">
            <span className='database-submit-title'>
                Create on Terminus Hub
            </span>
        </span>)*/
    }
}

export const DBControlPanel = ({meta, onChange}) => {
    let icon = meta.icon || ""

    let disp = "", isIcon=false;

    const [modal, setModal] = useState(false);
    const imagePickerToggle = () => setModal(!modal);

    const [imageUrl, setImageUrl] = useState(icon);

    const [dbDetailsImage, setdbDetailsImage] = useState(icon);

    if(icon){
        if(validURL(icon)) {
            disp = (<img className='database-listing-image' src={icon} key="xx1"  />)
            isIcon = false;
        }
        else{
            disp = (<i key="xx" className={'database-listing-icon ' + icon} />)
            isIcon = icon;
        }
    }

    const [iconImg, setIconImg] = useState(isIcon);
    const [val, setIcon] = useState(isIcon)

    const showPexels = false; // nuking pexels temporarily

    useEffect(() => {
        setIconImg(false)
        setdbDetailsImage(imageUrl);
        onChange(imageUrl);
    }, [imageUrl, dbDetailsImage]);

    function loadImageToDbDetailsForm () {
        setdbDetailsImage(imageUrl);
        setIconImg(false)
        setModal(false)
    }

    useEffect(() => {
            setIcon(val)
            setIconImg(val)
            onChange(val)
            setdbDetailsImage(false);
    }, [val])
    let vchange = function(selval){
        setIcon(selval)
        setdbDetailsImage(false)
        document.getElementById("imageUrlInput").value = "";
    }


    return (
        <div className="upload-pic">
            <div className="add-image-control-text">
                {showPexels && <div onClick={imagePickerToggle} className="image-picker-tile">
                    <div className="db-details-image">
                        {dbDetailsImage && !iconImg && <img src={dbDetailsImage} className="image-picker"/>}
                        {!dbDetailsImage && !iconImg && <IoMdImages color="#005cbf" className={"add-image-control"}/>}
                        {iconImg && !dbDetailsImage && <i class={iconImg + " add-image-control"}/>}
                        {<div className="image-picker-link image-align" >Click here to choose a picture </div>}
                    </div>
                </div>}

                {!showPexels && <div>
                    <div className="db-details-image">
                        {dbDetailsImage && !iconImg && <img src={dbDetailsImage} className="image-picker"/>}
                        {!dbDetailsImage && !iconImg && <IoMdImages color="#005cbf" className={"add-image-control"}/>}
                        {iconImg && !dbDetailsImage && <i class={iconImg + " add-image-control"}/>}
                    </div>
                </div>}
                {showPexels && <div className="image-align or-after-image-picker"> <hr/> <div className="or-text-hr">or</div></div>}

                <div className="image-align">
                    <input type="text"
                        id="imageUrlInput"
                        placeholder="Paste an Image URL"
                        className="database-create-id-input database-input-empty db-create-image-url"
                        onChange={  (e) =>{
                            setIcon(false); //set icon to false
                            setImageUrl(e.target.value)
                            onChange(e.target.value);
                            setdbDetailsImage(e.target.value);
                    }}/>
                </div>
                <div className="image-align or-after-image-picker"> <hr/> <div className="or-text-hr">or</div></div>

                <div className="image-align">
                    <FontIconPicker icons={ICONS_PICKER}
                        onChange={value => vchange(value)}
                        appendTo="body"
                        showSearch={true}
                        closeOnSelect={true}
                        renderUsing='class'
                        value={val}
                    />
                </div>
            </div>
            <Modal isOpen={modal} toggle={imagePickerToggle} contentClassName="custom-modal-style" size="lg">
                <ModalHeader toggle={imagePickerToggle}/>
                <ModalBody>
                    <Row key="mr">
                        <span className="upload-image-btn">
                            <button className="tdb__button__base tdb__button__base--bgreen delete-modal-button upload-image-align" onClick={loadImageToDbDetailsForm}>
                                <IoMdImages className="delete-modal-icon"/>
                                Upload Image
                            </button>
                        </span>
                    </Row>
                    <Row key="re">
                        <Pexels setImageUrl={setImageUrl}/>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    )
}

export const DBID = ({id, organization, hub_url, onChange, databases}) => {

    function doChange(t){
        if(t && t.target) onChange(t.target.value)
    }

    let s = _validate_id(id, organization, databases)
    let css = "database-input-" + s

    return (
        <span className="database-create-id-holder" >
            <span className = "database-create-id">
                <input
                    className={"database-create-id-input " + css}
                    type="text"
                    onChange={doChange}
                    value={id}
                    placeholder="Enter Database ID"
                />
            </span>
            <span className="database-create-id-result">
            {s == "ok" &&
                <DBRemoteURL hub_url={hub_url} id={id} organization={organization} />
            }
            {s != "ok" &&
                <InputResult state={s} />
            }
            </span>
        </span>
    )
}

export const DBTitle = ({label, organization, onChange, databases}) => {

    function doChange(t){
        if(t && t.target) onChange(t.target.value)
    }

    let s = _validate_title(label, organization, databases)
    let css = "database-input-" + s

    return (
        <span className="database-create-title-holder" >
            <span className = "database-create-title">
                <input
                    className={"database-create-title-input " + css}
                    type="text"
                    onChange={doChange}
                    value={label}
                    placeholder="Enter Database Title"
                />
            </span>
            <span className="database-create-title-result">
                <InputResult state={s} />
            </span>
        </span>
    )
}

export const DBRemoteURL = ({hub_url, organization, id}) => {
    let base = hub_url || ""
    base += organization + "/" + (id || "")

    return(
        <span>
            <AiFillCheckCircle title={id + " is a valid id for the database"} className="db_info_icon_spacing" color="#12aa22"/>
            <span title="This URL is the ID of your database on terminus hub" className="db_info">
            <AiOutlineLink className="db_icons_standard"/> {base}</span>
        </span>
    )
}

export const InputResult = ({state}) => {
    if(state && state == "empty"){
        return (<InputEmpty />)
    }
    else if(state && state == "ok"){
        return (<InputGood />)
    }
    else {
        return (<InputError problem={state} />)
    }
}

export const InputEmpty = ({}) => {
    return (<AiOutlineLeft className="db-required-color db_info_icon_spacing"/>)
}

export const InputGood = ({title}) => {
    let tit = title || tit
    return (<span><AiFillCheckCircle color="#12aa22" title='tit' className="db_info_icon_spacing"/> Title OK</span>)
}

export const InputError = ({problem}) => {
    return (
        <span className="create-input-error">
            <AiOutlineExclamation className="input-error-icon"/>
            {problem}
        </span>
    )
}

export const DBCredits = ({meta, onPrivacyChange, onSchemaChange, isEdit}) => {
    let res = []
    res.push(<DBRoleCredits key='dbxx' meta={meta} onPrivacyChange={onPrivacyChange} />)
    if(!isEdit){
        res.push(<DBSchemaCredits key='dbxxs' meta={meta} onSchemaChange={onSchemaChange} />)
        res.push(<DBProductionCredits key='dbx' meta={meta} />)
    }
    return res
}

export const DBProductionCredits = ({meta}) => {
    if(meta){
        var tit = (meta.organization_type ? meta.organization_type + " Organization" : "")
        let txt = (meta.organization_label ? meta.organization_label  : meta.organization)
        let icon = (meta.organization_icon ? (<img className="database-listing-organization-icon" src={meta.organization_icon}></img>) : "")
        return (
            <span>
                <AiOutlineUser className="db_info_icon_spacing"/>
                <span className="db_info">Publisher: {icon} {tit} <strong>{txt}</strong> </span>
            </span>
        )
    }
    return null
}

export const DBRoleCredits = ({meta, onPrivacyChange}) => {
    if(meta.public){
        return (
            <span title="Click to change to Private" className="privacy-holder">
                <span className="create-db-privacy" onClick={onPrivacyChange}>
                    <AiOutlineGlobal title="Public Database" className="db_info_icon_spacing"/>
                    <span className="db_info">
                        Public Database
                        <span className="create-change-privacy">
                            <AiOutlineDown className="db_icons_standard"/>
                        </span>
                    </span>
                </span>
            </span>
        )
    }
    return (
        <span title="Click to change to Public" className="privacy-holder">
            <span className="create-db-privacy" onClick={onPrivacyChange}>
                <AiFillLock title="Private Database" className="db_info_icon_spacing"/>
                <span className="db_info">
                    Private Database
                    <span className="create-change-privacy">
                        <AiOutlineDown className="db_icons_standard"/>
                    </span>
                </span>
            </span>
        </span>
    )
}

export const DBSchemaCredits = ({meta, onSchemaChange}) => {
    if(meta.schema){
        return (
            <span title="Click to change to schema free" className="privacy-holder">
                <span className="create-db-privacy" onClick={onSchemaChange}>
                    <AiOutlineSchedule title="Database has Schema" className="db_info_icon_spacing"/>
                    <span className="db_info">
                        With Schema
                        <span className="create-change-privacy">
                            <AiOutlineDown className="db_icons_standard"/>
                        </span>
                    </span>
                </span>
            </span>
        )
    }
    return (
        <span title="Click to add schema" className="privacy-holder">
            <span className="create-db-privacy" onClick={onSchemaChange}>
                <AiOutlineThunderbolt title="Schema Free Database" className="db_info_icon_spacing"/>
                <span className="db_info">
                    Schema Free
                    <span className="create-change-privacy">
                        <AiOutlineDown className="db_icons_standard"/>
                    </span>
                </span>
            </span>
        </span>
    )
}

export const DBDescription = ({meta, onChange}) => {
    if(meta.comment && meta.comment.length > 80 && !meta.testing){
        var str =  meta.comment.substring(76) + " ..."
    }
    else str = meta.comment || ""

    function doChange(t){
        if(t && t.target) onChange(t.target.value)
    }

    return (
        <Row className='database-description-input-row'>
            <textarea onChange={doChange} className="database-description-input" placeholder="Enter brief description of database" value={str}></textarea>
        </Row>
    )
}

function _validate_id(id, organization, databases){
    if(!id || id == ""){
        return "empty"
    }
    if(id.length > 30){
        return "Maximum length of id is 30 Characters"
    }
    if(!legalURLID(id)){
        return "ID can only consist of lower case letters a-z, numbers 0-9, dash -, and underscore _"
    }
    for(var i = 0; i<databases.length; i++){
        if(organization == databases[i].organization){
            if(databases[i].id == id){
                return `Duplicate ID - ${organization} already has a db with id ${id}`
            }
        }
    }
    return "ok"
}

function _validate_title(label, organization, databases){
    if(!label || label.trim() == ""){
        return "empty"
    }
    if(label.length > 40){
        return "Maximum length of title is 40 Characters"
    }
    for(var i = 0; i<databases.length; i++){
        if(organization == databases[i].organization){
            if(databases[i].label == label){
                return `Duplicate Title - ${organization} already has a db with that title`
            }
        }
    }
    return "ok"
}
