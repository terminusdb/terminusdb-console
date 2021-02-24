import React from 'react'
import {
    LoginPage,
    ConsoleRouter,
    ConsoleHistory,
    LoadingAppPage,
    ConnectionErrorPage,
    WOQLClientObj,
} from '@terminusdb/terminusdb-console'
import { Fragment } from 'react'

/**
 * Loads the client and connects to the server before doing anything else
 * @param {*} props
 */
const App = (props) => {
    const {showLogin, loadingServer, clientError, woqlClient} = WOQLClientObj()
    const goToNopage=()=>{
        ConsoleHistory.push("/test/notexist");
    }

    if (showLogin) return <LoginPage />
    if (clientError) return <ConnectionErrorPage />
    if (loadingServer) return <LoadingAppPage />

    return <Fragment>
         <button onClick={goToNopage}>goToNopage</button>
        <ConsoleRouter history={ConsoleHistory} />
           
            </Fragment>
}

export default App
