import React, {useState, useEffect, Fragment} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBNavbarTop} from './DBNavbarTop'
import {DBNavbar} from './DBNavbar'
import {ServerNavbar} from './ServerNavbar'
import {Login} from './Login'
import { Modal, ModalHeader, ModalBody } from "react-bootstrap" //replaced
import {UnderConstruction} from '../Reports/UnderConstruction'
import {LOGIN_LABEL,noHttps} from './constants.navbar'
import {HistoryNavigatorTimeline} from '../History/HistoryNavigatorTimeline';
import {NavLink} from 'react-router-dom'
import {HomeMainMenu} from './HomeMainMenu'
import { AiOutlineMail } from "react-icons/ai";
import { FeedbackForm } from "../Form/FeedbackForm"

export const ConsoleNavbar = (props) => {
    const {woqlClient} = WOQLClientObj()
    const [isOpen, setIsOpen] = useState(false)

    const [feedbackModal, setFeedbackModal] = useState(false);

    const feedbackToggle = () => {
        setFeedbackModal(!feedbackModal)
    }
    if(!woqlClient) return null

    let u = woqlClient.user()

    const toggleNavBar = () => setIsOpen(!isOpen)
    const [isTopOpen, setTopDropdownOpen] = useState(false)
    const toggleTop = () => setTopDropdownOpen((prevState) => !prevState)
    const topmenu =
        isTopOpen === true
            ? 'nav__main__center  nav__main__center--show'
            : 'nav__main__center nav__main__center--hide'
    if(!woqlClient) return null
    const showUnderCostruction = false//window.location.protocol === 'https' || window.location.host==="localhost:3005" ? false : true
    return (
        <Fragment>
            <header className="console__page__header">
                <nav className="nav__main">
                    <div className="nav__main__menu">
                        <button
                            className="nav__main__burger"
                            onClick={toggleTop}
                            role="button"
                            aria-label="Navigation burger button"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                    <ServerNavbar />
                    <ul className={topmenu}>
                        {!woqlClient.db() && <HomeMainMenu/>}
                        {woqlClient.db() && (
                            <DBNavbarTop
                                isOpen={isOpen}
                                page={props.page}
                                toggleTimeTravel={toggleNavBar}
                            />
                        )}
                    </ul>
                    <div className="nav__main__right">
                        {u.logged_in && 
                            <span title="Send us your feedback" onClick={feedbackToggle}>
                                <AiOutlineMail className="nav-feedback"/>
                            </span>
                        }
                        <Login />
                    </div>
                </nav>
            </header>
            {woqlClient.db() && <DBNavbar />}
            {isOpen && woqlClient.db() && <HistoryNavigatorTimeline woqlClient={woqlClient} />}
            <Modal isOpen={feedbackModal} toggle={feedbackToggle} className="feedback-form">
                <ModalHeader toggle={feedbackToggle} className="feedback-modal-head">Send us your feedback</ModalHeader>
                <ModalBody>
                    <FeedbackForm toggle={feedbackToggle}/>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}
