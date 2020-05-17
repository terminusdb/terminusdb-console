import React, { useState }  from "react";
import ReactTooltip from "react-tooltip";
import { UncontrolledAlert } from 'reactstrap';
import { COWDUCK_HELP_ICON } from "../../constants/images"
import {COWDUCK_CANCEL_CSS, COWDUCK_HELP_CSS, COWDUCK_ICON_CSS} from "./constants"


export const HelpCowDuck = (props) => {

    const [message, setMessage] = useState(false);

    return (<div className="App">
        {message && <div className={COWDUCK_HELP_CSS}>
            <button type ="button" className={COWDUCK_CANCEL_CSS} onClick={()=>{setMessage(false)}}>X</button>
            {props.text}
        </div>}
        {<img src={COWDUCK_HELP_ICON} className={COWDUCK_ICON_CSS} onClick={() => {setMessage(true)}}/>}
        {/*<button type ="button" data-tip data-for={"registerTip" + props.id} className="cow-duck-help-btn"
            onClick={() => {setMessage(true)}}>
            <img src={cowDuckImg} className="cow-duck-help"/>
        </button>*/}
        {/*<ReactTooltip id={"registerTip" + props.id} place="top" effect="solid">
           {'Click on me to get help :D'}
        </ReactTooltip>*/}
    </div>);

}
/*



{message && <UncontrolledAlert color="info">
    {props.text}
</UncontrolledAlert>}*/
