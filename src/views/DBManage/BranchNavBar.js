import React, {useState, useEffect} from "react";
import {Row, Col} from "react-bootstrap"
import {BsPlus} from "react-icons/bs"
import {AiOutlineBranches} from "react-icons/ai"
import {BiGitMerge, BiArrowBack} from "react-icons/bi"
import {RiDeleteBin5Line} from "react-icons/ri"
import {MdRefresh} from "react-icons/md"
import {FaCompressAlt} from "react-icons/fa"
import {BsCheckCircle} from "react-icons/bs"
import {NEW_BRANCH, MERGE_BRANCH, CLOSE_BRANCH, DELETE_BRANCH, RESET_BRANCH, OPTIMIZE_BRANCH, SQUASH_BRANCH} from "./constants.dbmanage"

const Header=({children})=>{
    return <div className="nav__main__wrap">
        <div className="tdb__model__header">
            <Col>
                <div className="tdb__model__hright">
                    <Row style={{width:"100%"}}>
                        {children}
                    </Row>
                </div>
            </Col>
        </div>
    </div>
}

const TotalBranches=({branchCount})=>{
    return <Col md={2}>
		<span className="db-card-credit subheader-spacing" title={branchCount + " branches"}>
	        <AiOutlineBranches className="db_info_icon_spacing"/>
	        <span className="db_info">
	            <span className="tdb__dblist__info--blue">
	                {branchCount}
	            </span>
	        </span>
	    </span>
	</Col>
}

const NewBranch=({title, setBranchAction, branchAction})=>{
    function onClick(){
        setBranchAction({branch:false, create:true, merge:false, reset: false, squash: false})
    }
    return <Col md={2}>
        <span style={{fontSize: "2em"}}>
            <span onClick={onClick} className="d-nav-icons" title={title}>
                <BsPlus className="db_info_icon_spacing" title={title}/>
            </span>
        </span>
    </Col>
}

const Merge=({title, setBranchAction, branchAction})=> {
    function onClick(){
        setBranchAction({branch:branchAction.branch, create:false, merge:true, reset: false, squash: false})
    }
    return <span style={{fontSize: "2em"}}>
        <span onClick={onClick} className="d-nav-icons" title={title}>
            <BiGitMerge className="db_info_icon_spacing" title={title}/>
        </span>
    </span>
}

const Close=({title, setBranchAction, branchAction})=>{
    function onClose(){
        setBranchAction({branch:false, create:false, merge:false, reset: false, squash: false})
    }
    return <span style={{fontSize: "2em"}}>
        <span onClick={onClose} className="d-nav-icons" title={title}>
            <BiArrowBack className="db_info_icon_spacing"/>
        </span>
    </span>
}

const Title=({branchAction})=>{
    return <Col md={3}>
        <h3 className="db_info d-nav-text">
            <span> Branch </span> ~ <span> {branchAction.branch} </span>
        </h3>
    </Col>
}

const Delete=({title, setBranchAction, branchAction, onDelete})=> {
    function onClick() {
        onDelete(branchAction.branch)
        setBranchAction({branch:false, create:false, merge:false, reset: false, squash: false})
    }
    return <span style={{fontSize: "2em"}}>
        <span title={title} onClick={onClick} className="d-nav-icons">
            <RiDeleteBin5Line color="#721c24" className='schema-toolbar-delete'/>
        </span>
    </span>
}

const Reset=({title, setBranchAction, branchAction})=> {
    function onClick() {
        setBranchAction({branch:branchAction.branch, create:false, merge:false, reset: true, squash: false})
    }
    return <span style={{fontSize: "2em"}}>
        <span onClick={onClick} className="d-nav-icons" title={title}>
            <MdRefresh className="db_info_icon_spacing"/>
        </span>
    </span>
}

const Optimize=({title, setBranchAction, branchAction})=> {
    return <span style={{fontSize: "2em"}}>
        <span className="d-nav-icons" title={title}>
            <BsCheckCircle className="db_info_icon_spacing"/>
        </span>
    </span>
}

const Squash=({title, setBranchAction, branchAction})=> {
    function onClick() {
        setBranchAction({branch:branchAction.branch, create:false, merge:false, reset: false, squash: true})
    }
    return <span style={{fontSize: "2em"}}>
        <span className="d-nav-icons" title={title} onClick={onClick}>
            <FaCompressAlt className="db_info_icon_spacing"/>
        </span>
    </span>
}

export const BranchNavBar=({branchCount, branchAction, setBranchAction, onDelete})=>{
    let children = []
    children.push(<TotalBranches branchCount={branchCount}/>)
    children.push(<NewBranch title={NEW_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction}/>)
    if(branchAction.branch) {
        children.push(<Title branchAction={branchAction}/>)
        children.push(<Col md={1}/>)
        children.push(<Merge title={MERGE_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction}/>)
        children.push(<Reset title={RESET_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction}/>)
        children.push(<Optimize title={OPTIMIZE_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction}/>)
        children.push(<Squash title={SQUASH_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction}/>)
        children.push(<Col md={1}/>)
        children.push(<Delete title={DELETE_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction} onDelete={onDelete}/>)
        children.push(<Close title={CLOSE_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction}/>)
    }
    if(branchAction.create){
        children.push(<Col md={6}/>)
        children.push(<Close title={CLOSE_BRANCH} setBranchAction={setBranchAction} branchAction={branchAction}/>)
    }
    return <Header children={children}/>
}
