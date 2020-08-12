import React, {useState, Fragment} from 'react'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBNavbar} from './DBNavbar'
import {ServerNavbar} from './ServerNavbar'
import {Login} from './Login'
import {UnderConstruction} from '../Reports/UnderConstruction'
import {LOGIN_LABEL,noHttps} from './constants.navbar'
import {HistoryNavigatorTimeline} from '../History/HistoryNavigatorTimeline';
import {NavLink} from 'react-router-dom'

export const ConsoleNavbar = (props) => {
    const {woqlClient} = WOQLClientObj()
    const [isOpen, setIsOpen] = useState(false)

    const toggleNavBar = () => setIsOpen(!isOpen)
    const [isTopOpen, setTopDropdownOpen] = useState(false)
    const toggleTop = () => setTopDropdownOpen((prevState) => !prevState)
    const topmenu =
        isTopOpen === true
            ? 'nav__main__center  nav__main__center--show'
            : 'nav__main__center nav__main__center--hide'

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
                        <li className="nav__main__item ">
                            <a href="https://terminusdb.com/docs/" 
                                target="_blank" className="nav__main__link" aria-label="Documentation">
                            Documentation
                            </a>
                        </li>
                        
                         <li className="nav__main__item ">
                           <a href="https://terminusdb.com/community/" target="_blank" className="nav__main__link" aria-label="Community">
                            Community
                            </a>
                        </li>
                         <li className="nav__main__item ">
                            <a href="https://terminusdb.com/blog/" target="_blank" className="nav__main__link" aria-label="Blog">
                            Blog
                            </a>
                        </li>
                    </ul>
                    <div className="nav__main__right">
                        {showUnderCostruction && (
                            <UnderConstruction
                                buttonClassName="tdb__button__base nav__main__login"
                                buttonColor={'white'}
                                buttonText={LOGIN_LABEL}
                                action="Login in HUB"
                                headerText={noHttps.title}
                                description={noHttps.description}
                                noEmail={true}
                                noIcon={true}
                            />
                        )}
                        {showUnderCostruction === false && <Login />}
                    </div>
                </nav>
            </header>
            {isOpen && woqlClient.db() && <HistoryNavigatorTimeline woqlClient={woqlClient} />}
        </Fragment>
    )
}
/*
{woqlClient.db() && (
                            <DBNavbar
                                isOpen={isOpen}
                                page={props.page}
                                toggleTimeTravel={toggleNavBar}
                            />
                        )}*/