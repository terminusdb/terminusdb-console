/**
 * Defines universal structure of Terminus Console page:
 * Full Page Container
 *      Navbar (top of page)
 */
import React from "react";
import { ConsoleNavbar } from "../../components/Navbar/ConsoleNavbar";
import { Container } from "reactstrap";
import Footer  from "./Footer"
import Loading from "../../components/Reports/Loading"
import { PAGEVIEW } from "./constants.templates"
import { TERMINUS_PAGE } from "../../constants/identifiers"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks"


export const PageView = (props) => {
    return (
        <Container className={PAGEVIEW.containerCSS} id="terminus-console-page">
            <Container fluid className={PAGEVIEW.navbarContainerCSS}>
                <ConsoleNavbar onHeadChange={props.onHeadChange} />
            </Container>
            <Container className={PAGEVIEW.pageContentCSS}>      
                {props.report && 
                    <TerminusDBSpeaks report={props.report} />
                }
                {props.loading && 
                    <Loading type={TERMINUS_PAGE} />
                }
                { props.children }
            </Container>
        </Container>
    )
}
