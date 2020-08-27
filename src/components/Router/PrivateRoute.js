import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { useAuth0 } from "../../react-auth0-spa";
import { PageView } from '../../views/Templates/PageView'
import {LOGIN_LABEL} from '../Navbar/constants.navbar'
import {Row, Col } from "react-bootstrap";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    /*useEffect(() => {
        const fn = async () => {
            if (!isAuthenticated) {
                await loginWithRedirect({
                    appState: { targetUrl: path }
                });
            }
        }
        fn()
    }, [isAuthenticated, loginWithRedirect, path])*/

    const render = props =>
        isAuthenticated === true ? <Component {...props} /> : <NoLoginLayout loginWithRedirect={loginWithRedirect}/>;
        return <Route path={path} render={render} {...rest} />;
}

const NoLoginLayout = (props) =>{

    return (
            <PageView >
                <div className="console__page__box">
                    <div className="console__page__title">
                        You need to login in hub to see this page
                    </div>
                    <button id="login_clone_button" className="tdb__button__base nav__main__login" onClick={ () => props.loginWithRedirect()}>
                        {LOGIN_LABEL}
                    </button>
                </div>
            </PageView>
        )

}

PrivateRoute.propTypes = {
    /*component: PropTypes.oneOfType([
        PropTypes.element, 
        PropTypes.func]
    ).isRequired,*/
    path: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired
};

export default PrivateRoute;