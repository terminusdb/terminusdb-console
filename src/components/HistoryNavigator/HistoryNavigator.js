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


export const HistoryNavigator = (props) => {
    const [branches, setBranches] = useState(props.branches);
    const [ref, setRef] = useState(props.ref);
    const [start, setStart] = useState(props.start || parseFloat(subDays(startOfToday(), 7).getTime()/1000));
    const [end, setEnd] = useState(props.end || parseFloat(new Date().getTime()/1000));
    const [current, setCurrent] = useState(props.current || parseFloat(new Date().getTime()/1000));
    const [currentCommit, setCommit] = useState({});
    const [commitCount, setCommitCount] = useState(0);
	const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    const [branch, setBranch] = useState(props.branch || dbClient.checkout());

    const always = 1
    //retrieves details of the branch, only when the branch is changed
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchLimits(dbClient)
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

    //retrieves details of the available branches
    useEffect(() => {
        const q = TerminusClient.WOQL.lib().loadBranchNames(dbClient)
        dbClient.query(q).then((results) => {
            let wr = new TerminusClient.WOQLResult(results, q)
            let bchoices = []
            var res
            while(res = wr.next()){
               bchoices.push({value: res['BranchName']["@value"], label: res['BranchName']["@value"]})
            }
            bchoices.push({value: "test", label: "test"})
            setBranches(bchoices) 
        })    
    }, [always]);

    //retrieves details of the commit with id ref 
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

    //retrieves the last recent commit and sets it, when the user changes point on the timeline
    function userChangesTime(ts){
        if(ts && (Math.floor(current) != Math.floor(ts))){
            setCurrent(ts)
            let tx = ts + ""
            const q3 = TerminusClient.WOQL.lib().loadCommitBefore(dbClient, tx)
            dbClient.query(q3).then(( lresults) => {
                let lwr = new TerminusClient.WOQLResult(lresults, q3)
                let lres = lwr.first()
                let commie = {}
                commie.id = (lres['TailID']["@value"])
                commie.time = parseFloat(lres['Time']["@value"])
		        commie.author = lres['Author']["@value"]
		        commie.message = lres['Message']["@value"]
		        commie.parent = lres['Parent']["@value"]
                commie.child = lres['Child']["@value"]
                if(commie.parent) dbClient.ref(commie.id)
                else dbClient.ref(false)
                setCommit(commie)
            })
        }
    }   

    function userChangesCommand(ts){

    }

    function changeBranch(bid){
        setBranch(bid)        
        dbClient.ref(false)
        dbClient.checkout(bid)
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
                        <BranchSelector branch={branch} branches={branches} onChange={changeBranch}/>
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

