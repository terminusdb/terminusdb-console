import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { CreateOptions } from "./CreateOptions"
import { CopyOptions } from "./CopyOptions"
import { CreateOrCopy } from "./CreateOrCopy"
import { DBCreateForm } from "./CreateLocalForm"
import { CopyLocalForm } from "./CopyLocalForm"
import { CopyRemoteForm } from "./CopyRemoteForm"
import { CreateRemoteForm } from "./CreateRemoteForm"
import { Crumbs } from "../Templates/BreadCrumbs"

import {CREATE_BREADCRUMB, COPY_BREADCRUMB, LOCAL_BREADCRUMB, REMOTE_BREADCRUMB, 
    CREATE_REMOTE, COPY_REMOTE, CREATE_LOCAL, COPY_LOCAL, LOCAL_OR_REMOTE } from "./constants.createdb"

const CreateDatabase = (props) => {
	const [page, setPage] = useState()
    const [btns, setBtns] = useState()

    useEffect(() => {
        if(!page) setBtns([])
        else {
            let buts = page.split("_")
            setBtns(getButtons(buts))
        }
    }, [page])

    function setCreate(){
        setPage("create")
    }

    function setCreateLocal(){
        setPage("create_local")
    }

    function setCreateRemote() {
        setPage("create_remote")
    }

    function setCopy(){
        setPage("copy")
    }

    function setCopyRemote() {
        setPage("copy_remote")
    }

    function setCopyLocal() {
        setPage("copy_local")
    }

    function getButtons(btns){
        let nbts = []
        let but = {}
        if(btns[0] == "create"){
            but.page = false
            but.text = CREATE_BREADCRUMB
        }
        else if(btns[0] == "copy"){
            but.page = false
            but.text = COPY_BREADCRUMB
        }
        nbts.push(but)
        if(btns[1]){
            if(btns[1] == "local"){
                nbts.push({page: btns[0], text: LOCAL_BREADCRUMB })            
                if(btns[0] == "create"){
                    nbts.push({text: CREATE_LOCAL })            
                }    
                else {
                    nbts.push({text: COPY_LOCAL })            
                }
            }
            else if(btns[1] == "remote"){
                nbts.push({page: btns[0], text: REMOTE_BREADCRUMB })
                if(btns[0] == "create"){
                    nbts.push({text: CREATE_REMOTE })            
                }
                else {
                    nbts.push({text: COPY_REMOTE })              
                }
            }
        }
        else {
            nbts.push({text: LOCAL_OR_REMOTE})
        }
        return nbts
    }

	return (
		<Container fluid className="h-100 pl-0 pr-0">
			<Container className="flex-grow-1">
		        <hr className = "my-space-50"/>
				{!page && <>
					<Crumbs/>
    		        <hr className = "my-space-50"/>
                    <CreateOrCopy 
                        setCreate = { setCreate } 
                        setCopy = { setCopy }
                    />
                </>}

				{(page == "create") && <>
					<Crumbs buttons = {btns} setPage = { setPage }/>
    		        <hr className = "my-space-50"/>
                    <CreateOptions 
                        setRemote = { setCreateRemote } 
                        setLocal = { setCreateLocal }
                    />
				</>}
				{(page == "copy") && <>
					<Crumbs buttons = {btns} setPage = { setPage }/>
    		        <hr className = "my-space-50"/>
                    <CopyOptions 
                        setRemote = { setCopyRemote } 
                        setLocal = { setCopyLocal }
                    />
				</>}
				{(page == "create_local") && <>
					<Crumbs buttons={btns} setPage = { setPage }/>
    		        <hr className = "my-space-50"/>
					<DBCreateForm />
				</>}
				{(page == "create_remote") && <>
					<Crumbs buttons={btns} setPage = { setPage }/>
    		        <hr className = "my-space-50"/>
					<CreateRemoteForm />
				</>}
				{(page == "copy_local") && <>
					<Crumbs buttons={btns} setPage = { setPage }/>
    		        <hr className = "my-space-50"/>
					<CopyLocalForm />
				</>}
				{(page == "copy_remote") && <>
					<Crumbs buttons={btns} setPage = { setPage }/>
    		        <hr className = "my-space-50"/>
					<CopyRemoteForm />
				</>}

			</Container>
	    </Container>
	)
}

export default CreateDatabase;
