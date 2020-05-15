import React, { useState }  from "react";
import ReactTooltip from "react-tooltip";
import { UncontrolledAlert } from 'reactstrap';

const cowDuckImg = "https://assets.terminusdb.com/terminusdb-console/images/cowDuckHelp.png";

export const HelpCowDuck = (props) => {

    const [message, setMessage] = useState(false);

    return (<div className="App">
        {message && <div className="help-text">
            <button type ="button" className="cow-duck-help-cancel" onClick={()=>{setMessage(false)}}>X</button>
            {props.text}
        </div>}
        {<img src={cowDuckImg} className="cow-duck-help" onClick={() => {setMessage(true)}}/>}
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
