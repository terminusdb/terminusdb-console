import React, { useState } from "react";
import { Row } from "reactstrap";
import { QueryPane } from "../../components/QueryPane/QueryPane"
import { SimplePageView } from '../Templates/SimplePageView'
import { NEW_QUERY_BUTTON_CSS, NEW_QUERY_BUTTON_TEXT, NEW_QUERY_ROW_CSS, QUERY_BOX_CSS } from "./constants.pages"

/**
 * The main database query page - just consists of a query pane and
 * a button allowing you to create more panes
 */

const QueryPage = () => {

    const QueryPaneBox = (props) => {
        const {qp, setQp} = props.pstate;        
        return (
            <div className={QUERY_BOX_CSS}>
                <QueryPane type="editor"/>
                <Row className={NEW_QUERY_ROW_CSS} style={{justifyContent:"flex-end"}}> 
                    <button 
                        className = { NEW_QUERY_BUTTON_CSS }
                        type =  "submit"
                        onClick={() => { setQp([...qp, qp.length]) }}
                    >
                        {NEW_QUERY_BUTTON_TEXT}
                    </button>
                </Row>
            </div>
        );
    }

    const NewQueryPane = (props) => {
        const [qp, setQp] = useState([0]);
        return qp.map(m => <QueryPaneBox key={m}
            qpNumber={m}
            pstate={{qp, setQp}}/>
        );
    }

    return (
        <SimplePageView>
            <NewQueryPane/>
        </SimplePageView>    
    )
}

/*
*/
export default QueryPage;

