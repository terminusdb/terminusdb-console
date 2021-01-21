import React, {useState, useEffect} from 'react'
import {TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS, TERMINUS_INFO} from '../../constants/identifiers'
import {Row, Col} from "react-bootstrap" //replaced
import { legalURLID } from '../../components/Query/CollaborateAPI'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'

export const AddRemote = ({onCreate, onCancel, repos, error}) => {
    const [newID, setID] = useState("")
    const [remoteURL, setRemoteURL] = useState("")
    let intro = {
        status: TERMINUS_INFO,
        message: "Adding a remote to your database allow you to merge data from a remote database into your database and vice versa."
    }
    const [report, setReport] = useState(intro)

    function onGo(){
        let problem = false
        if(!newID){
            problem = "You must provide an ID for the new remote"
        }
        else if(!legalURLID(newID)){
            problem = "Branch IDs can only include lowercase characters, numbers and underscores and be no more than 40 characters long"
        }
        else if(!remoteURL){
            problem = "You must provide a URL for the remote database (of the form https://my.terminus.server/user/db)"
        }
        else if(!validRemoteURL(remoteURL)){
            problem = "Invalid Remote URL - it should take the form https://my.terminus.server/org_id/db_id"
        }
        for(var r in repos){
            if(repos[r].title == newID){
                problem = `ID ${newID} is already taken`
            }
            else if(repos[r].url == remoteURL){
                problem = `${remoteURL} is already a remote of this database (Remote ID : ${repos[r].title})`
            }
            if(problem) break
        }
        if(!problem){
            onCreate(newID, remoteURL)
        }
        let prob = {status: TERMINUS_ERROR, message: problem}
        setReport(prob)
    }

    function validRemoteURL(t){
        if(!(t && (t.substring(0, 8) == "https://" || t.substring(0, 7) == "http://"))){
            return false
        }
        return true
    }


    function updateID(t){
        if(report.status == TERMINUS_ERROR) setReport(intro)
        if(t && t.target) setID(t.target.value)
    }

    function updateURL(t){
        if(report.status == TERMINUS_ERROR) setReport(intro)
        if(t && t.target) setRemoteURL(t.target.value)
    }

    return(<>
        {report &&     
            <span className="database-list-intro"><TerminusDBSpeaks report={report} /></span>
        }
        <Row>
            <Col md={3}>
                <input
                    placeholder="New Remote ID"
                    value={newID}
                    onChange={updateID}
                    type="text" />
            </Col>
            <Col md={5}>
                <input
                    placeholder="URL of remote" 
                    value={remoteURL}
                    onChange={updateURL}
                    type="text" />
            </Col>
            <Col md={3}>
                <button type="submit" onClick={onGo} className="tdb__button__base tdb__button__base--green">
                    Add New Remote
                </button>
            </Col>
            <Col md={1}>
                <button type="submit" onClick={onCancel} className="tdb__button__base tdb__button__base--gray">
                    Cancel
                </button>
            </Col>
        </Row>
 </>   )
}