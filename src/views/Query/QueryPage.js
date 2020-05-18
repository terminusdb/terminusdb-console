import React, { useState } from "react";
import { Container , Col, Button, Row } from "reactstrap";
import { QueryPane } from "../../components/QueryPane/QueryPane"
import { WOQL_JS, WOQL_JSON, WOQL_PY } from '../../labels/queryFormats'
import { queryControls } from "../../variables/formLabels"
import * as q from "../../labels/queryLabels";
import * as view from "../../labels/viewLabels"
import { PageView } from '../PageView'
import {ConsoleNavbar} from "../../components/Navbar/ConsoleNavbar";


const QueryPage = (props) => {
  const editor = {edit: true,
      submit: 'Run Query',
      library: [q.SHOW_ALL_SCHEMA_ELEMENTS,
                q.SHOW_ALL_CLASSES,
                q.SHOW_ALL_PROPERTIES,
                q.SHOW_DOCUMENT_CLASSES],
      languages: [WOQL_JS, WOQL_JSON] ,
      library_autosubmit: false
  };

  const resultReport = {
      success: true
  }

  const resultPane = {
      viewEditor: {
          edit: true,
          submit: 'Update View',
          languages: [WOQL_JS, WOQL_JSON],
          closable: true
      },
      view: [view.TABLE_VIEW, view.GRAPH_VIEW]
  }

 const QueryPaneBox = (props) => {
      const {caption} = props;
      const {qp, setQp} = props.pstate;
      
      return (
        <div className="query-box">
            <QueryPane type="editor"/>
            <Row style={{justifyContent:"flex-end"}}> 
              <button className = { queryControls.newQuery.className }
                  type =  { queryControls.newQuery.type }
                  onClick={() => { setQp([...qp, qp.length]) }}>
                  {queryControls.newQuery.text}
              </button>
            </Row>
        </div>);
  }

 const NewQueryPane = (props) => {
     const [qp, setQp] = useState([0]);
     return qp.map(m => <QueryPaneBox key={m}
        qpNumber={m}
        pstate={{qp, setQp}}/>
    );
  }
  /*
  <Row text-align="right">
              <button className = { queryControls.newQuery.className }
                  type =  { queryControls.newQuery.type }
                  onClick={() => { setQp([...qp, qp.length]) }}>
                  {queryControls.newQuery.text}
              </button>
            </Row>*/

  return (   
    <Container fluid className="h-100 pl-0 pr-0">
        <ConsoleNavbar/>
        <Container className="flex-grow-1 h-100 ">      
          <NewQueryPane/>
        </Container>
    </Container>      
    
	)
}

/*
<PageView>
        <NewQueryPane/>
    </PageView>*/
export default QueryPage;
