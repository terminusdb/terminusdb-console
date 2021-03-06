import React, { useState } from "react";
import { Row } from "react-bootstrap" //replaced;
import { QueryPane } from "../../components/QueryPane/QueryPane"
import { PageView } from '../Templates/PageView'
import { NEW_QUERY_BUTTON_TEXT } from "./constants.pages"

/**
 * The main database query page - just consists of a query pane and
 * a button allowing you to create more panes
 */

const QueryPage = () => {

    

    const QueryPaneBox = (props) => {
        const {qp, setQp} = props.pstate;        
        return (
            <div className="tdb__qpane" id={props.id}>
                <QueryPane type="editor"/>              
                    <button 
                        className = "tdb__button__base tdb__button__base--bgreen tdb__qpane__button__new__panel"
                        type =  "submit"
                        onClick={() => { setQp([...qp, qp.length]) }}
                    >
                        {NEW_QUERY_BUTTON_TEXT}
                    </button>               
          </div>
        );
    }

    const NewQueryPane = (props) => {
        const [qp, setQp] = useState([0]);
        return qp.map(m => <QueryPaneBox key={m} id={`queryPane_${m}`}
            qpNumber={m}
            pstate={{qp, setQp}}/>
        );
    }

    return (
        <PageView dbPage={true}>
            <NewQueryPane/>
        </PageView>    
    )
}

/*
*/
export default QueryPage;

