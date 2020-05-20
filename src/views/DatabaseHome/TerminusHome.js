import React, { useState, useEffect } from "react";
import { PageView } from '../PageView'
import { TCForm } from  "../../components/Form/FormComponents"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_INFO} from "../../constants/identifiers"
import { TERMINUS_HOME_TITLE, TERMINUS_HOME_ADVICE } from "./constants" 
import { TerminusHomeWarning } from "../../components/Reports/TerminusHomeWarning"




const TerminusHome = (props) => {
    //onchange
    //validate
    //containerClassCname
    //layout
    return (  
        <PageView>
                <TerminusHomeWarning body={TERMINUS_HOME_ADVICE} heading={TERMINUS_HOME_TITLE} />
        </PageView>   
	)
}
export default TerminusHome;

