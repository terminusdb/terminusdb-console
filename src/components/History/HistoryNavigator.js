/**
 * The history navigator is a UI widget which allows a user to change their branch and time to view the database at
 * any specific time / branch
 */
import React, { useState, useEffect } from "react";
import { addHours, startOfHour } from "date-fns";
import { Container, Col, Row } from "reactstrap";
import { BranchSelector } from './BranchSelector'
import { DateTimeSlider } from './DateTimeSlider'
import { CommitTraveller } from './CommitTraveller'
import TerminusClient from '@terminusdb/terminusdb-client';
import {HISTORY} from "./constants.history"
import { DBContextObj} from "../Query/DBContext"

//import {HistoryNavigatorHook} from "./HistoryNavigatorHook"
//import {HistoryNavigatorObj } from "../../init/history-navigator-instance";

export const HistoryNavigator = (props) => {
    const { setConsoleTime, consoleTime, setHead, branch, ref, DBInfo, branches} = DBContextObj();

    let st = consoleTime || (Date.now()/1000)

    let endts = parseFloat(startOfHour(addHours(new Date(), 1)).getTime()/1000)
    const [end, setEnd] = useState(endts);
    const [current, setCurrent] = useState(st);

    useEffect(() => {
        if(consoleTime) setCurrent(consoleTime)
        else setCurrent(Date.now()/1000)
    }, [consoleTime])
    
    function userChangesTime(ts){
        if(props.onChangeTime) props.onChangeTime(ts)
        else setConsoleTime(ts)
    }

    function userChangesCommit(id){
        if(props.onChangeHead) props.onChangeHead(branch, id)
        else setHead(branch, id)
    }

    function getCommitID(){
        if(ref) return ref
        if(branches && branches[branch]) return branches[branch].head
        return null
    }


    return (
        <Container className={HISTORY.containerClassName}>
            <Row>
                {DBInfo &&
                    <Col md={8} className={HISTORY.sliderColClassName}>
                        <DateTimeSlider start={DBInfo.created}
                            onChange={userChangesTime}
                            end={end}
                            current={current}
                        />
                    </Col>
                }
                {branches && branches[branch] && 
                    <Col md={4} className={HISTORY.commitColClassName}>
                        <CommitTraveller setRef={userChangesCommit} commit={getCommitID()}/>
                    </Col>
                }
            </Row>
        </Container>
    )
}
