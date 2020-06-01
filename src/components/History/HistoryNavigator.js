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

//import {HistoryNavigatorHook} from "./HistoryNavigatorHook"
import {HistoryNavigatorObj } from "../../init/history-navigator-instance";

export const HistoryNavigator = (props) => {

     const {changeBranch,
            userChangesCommit,
            userChangesTime,
            branches,
            end,
            current,
            currentCommit,
            settingCommit,
            branchInfo} = HistoryNavigatorObj()

            //HistoryNavigatorHook(props.woqlClient,props.setRefId)

	
    const cct = (currentCommit ? currentCommit.time : current)
    const showBranches = (branches && branchInfo && (branches.length > 0))
    return (
        <Container className={HISTORY.containerClassName}>
            <Row>
                {(branches && branchInfo) &&
                    <Col md={6} className={HISTORY.sliderColClassName}>
                            <DateTimeSlider start={branchInfo.first}
                                onChange={userChangesTime}
                                end={end}
                                current={current}
                                updated={cct} />
                    </Col>
                }
                {(branches && branchInfo) &&
                    <Col md={4} className={HISTORY.commitColClassName}>
                            {currentCommit && <CommitTraveller setRef={userChangesCommit} commit={currentCommit}/>}
                    </Col>
                }
                {showBranches &&
                    <Col md={1} className={HISTORY.branchColClassName}>
                            <BranchSelector branch={branchInfo} branches={branches} onChange={changeBranch}/>
                    </Col>
                }
            </Row>
        </Container>
    )
}
