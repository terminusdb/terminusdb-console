import React from "react"
import { WOQLClientObj } from "../../init/woql-client-instance"
import { NavLink } from "react-router-dom"
import { SERVER_ROUTE} from "../../constants/routes"

export const ServerNavbar = (props) => {

    const {woqlClient} = WOQLClientObj();
    const handleClick = () => {
        //clear the database context 
        woqlClient.connectionConfig.clearCursor()
    }

    return (
        <div className="nav__main__left">
            <NavLink to={SERVER_ROUTE} className="nav__main__logo" onClick = {handleClick}>
                 <img src="https://terminusdb.com/img/logos/logo.svg" alt="Terminus DB logo"/>
            </NavLink>         
        </div>      
      )
}