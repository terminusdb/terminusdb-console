/**
 * The history navigator is a UI widget which allows a user to change their branch and time to view the database at 
 * any specific time / branch
 */
import React, { useState, useEffect } from "react";
import { subDays, startOfToday, format } from "date-fns";
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { Container, Row, Col, Jumbotron,
    Button,Form,FormGroup,Label,Input,FormText,Collapse} from "reactstrap";
import BranchSelector from './BranchSelector'
import { DateTimeSlider } from './DateTimeSlider'

import TerminusClient from '@terminusdb/terminus-client';
import { commit } from "../../variables/formLabels";


export const HistoryNavigator = (props) => {
    const [branch, setBranch] = useState(props.branch);
    const [ref, setRef] = useState(props.ref);
    const [start, setStart] = useState(props.start || parseFloat(subDays(startOfToday(), 7).getTime()/1000));
    const [end, setEnd] = useState(props.end || parseFloat(new Date().getTime()/1000));
    const [current, setCurrent] = useState(props.current || parseFloat(new Date().getTime()/1000));
    const [currentCommit, setCommit] = useState({});
    const [commitCount, setCommitCount] = useState(0);
	const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    //retrieves details of the branch, only when the branch is changed
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().getBranchLimits(dbClient)
        dbClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let res = wr.first()
            let last = res['Last']['@value'] 
            let first = res['First']['@value'] || last
            let cc = ((res['Path'] && Array.isArray(res['Path'])) ? res['Path'].length : 1)
            setStart(parseFloat(first)) 
            setCommitCount(cc)
            if(!ref){
                setRef(res['HeadID']["@value"])
            } 
        })    
    }, [branch]);

    useEffect(() => {
        if(ref){
            const q2 = TerminusClient.WOQL.lib().loadCommitDetails(dbClient, ref)
            dbClient.query(q2).then((cresults) => {
                let cwr = new TerminusClient.WOQLResult(cresults, q2)
                let cres = cwr.first()
                let commie = { id: ref}
                commie.time = parseFloat(cres['Time']["@value"])
		        commie.author = cres['Author']["@value"]
		        commie.message = cres['Message']["@value"]
		        commie.parent = cres['Parent']["@value"]
		        commie.child = cres['Child']["@value"]
                setCommit(commie)
                if(dbClient.ref()) setCurrent(commie.time)
                else setCurrent(end)
            })
        }    
    }, [ref]);

    function userChangesTime(ts){
        if(ts && (Math.floor(current) != Math.floor(ts))){
            setCurrent(ts)
            const q3 = TerminusClient.WOQL.lib().loadCommitBefore(dbClient, ts)
            dbClient.query(q3).then(( lresults) => {
                let lwr = new TerminusClient.WOQLResult(cresults, q3)
                let lres = lwr.first()
                let commie = {}
                commie.id = (cres['TailID']["@value"])
                commie.time = parseFloat(cres['Time']["@value"])
		        commie.author = rles['Author']["@value"]
		        commie.message = lres['Message']["@value"]
		        commie.parent = lres['Parent']["@value"]
		        commie.child = lres['Child']["@value"]
                setCommit(commie)
            })
        }
    }

    if(dbClient.db() != "terminus"){
        return (
            <Container>
                <span className = "d-fl mb-12">
                    <Col md={8} className="mb-8">
                        <DateTimeSlider start={start} onChange={userChangesTime} end={end} current={current} updated={currentCommit.time} />
                    </Col>
                    <Col md={1} className="mb-1"/>
                    <Col md={3} className="mb-3">
                        <BranchSelector branch={branch}/>
                    </Col>
                </span>
                <span className = "d-fl mb-8 cc">
                    {branch} - {ref} - {commitCount} - {start} - {end} - {current} - {currentCommit.author}                
                </span>
            </Container>
        )
    }
    return null
}

