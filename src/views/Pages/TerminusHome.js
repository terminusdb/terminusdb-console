import React from "react";
import { PageView } from '../Templates/PageView'
import { TERMINUS_HOME_TITLE, TERMINUS_HOME_ADVICE } from "./constants.pages" 
import { TerminusHomeWarning } from "../../components/Reports/TerminusHomeWarning"

const TerminusHome = (props) => {   
    return (  
        <PageView>
            <TerminusHomeWarning body={TERMINUS_HOME_ADVICE} heading={TERMINUS_HOME_TITLE} />
        </PageView>   
	)
}
export default TerminusHome;

