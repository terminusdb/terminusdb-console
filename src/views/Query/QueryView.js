import React, { useState } from "react";
import { Container , Col, Button } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import NavBar from '../../components/NavBar';
import { RenderSnippet } from "../../components/RenderSnippet";
import { QUERY_PAGE } from "../../variables/pageLabels"
//import { QueryPane } from "./QueryPane"
import { queryControls } from "../../variables/formLabels"
import Collapsible from 'react-collapsible';
import { WOQL_JS, WOQL_JSON, WOQL_PY } from '../../labels/queryFormats'
import * as query from "../../labels/queryLabels";
import * as view from "../../labels/viewLabels"
import { isObject, isArray } from "../../utils/helperFunctions";

import { Preview } from "../../components/QueryPane/Preview" // temp test
import { QueryPane } from "../../components/QueryPane/QueryPane" // temp test

const Query = (props) => {

  const { loading, user } = useAuth0();

  if (loading) return <Loading />;

 /* const NewQueryPane = (props) => {
     const [qp, setQp] = useState([0]);
      return <Collapsible trigger={"Query Pane - "}>
        <QueryEditor qpNumber={2}/>
      </Collapsible>

  }*/



  const QueryPanes = (props) => {
      const {caption} = props;
      const {qp, setQp} = props.pstate;
      const [open, setOpen] = useState(true);
      return (<>
          <Collapsible
            trigger={"Query Pane - " + props.qpNumber}>
              {<QueryPane qpNumber={props.qpNumber}/>}
              <button className = { queryControls.newQuery.className }
                  type =  { queryControls.newQuery.type }
                  onClick={() => { setQp([...qp, qp.length]);}}>
                  {queryControls.newQuery.text}
              </button>
            </Collapsible>
            </>);
  }

  const NewQueryPane = (props) => {
     const [qp, setQp] = useState([0]);
     return <QueryPane qConfig = {{showQuery: true, editQuery: true}}/>
     /*return qp.map(m => <QueryPanes key={m}
                         qpNumber={m}
                         pstate={{qp, setQp}}/>
        );*/

  }




  const queryPaneOptions = {edit: true,
      submit: true,
      languages: [WOQL_JS, WOQL_JSON],
      library: [query.SHOW_ALL_SCHEMA_ELEMENTS,
                query.SHOW_ALL_CLASSES,
                query.SHOW_ALL_PROPERTIES],
      library_autosubmit: false,
      submit: 'Run Query'
  };

  const resultPaneOptions = {
      viewEditor: {
          edit: true,
          languages: [WOQL_JS, WOQL_JSON],
          submit: 'Update View'
      },
      view: [view.TABLE_VIEW, view.GRAPH_VIEW]
  }

  return (
      <Container fluid className="h-100 pl-0 pr-0">
          <NavBar/>
    	  <Container className="flex-grow-1">
            {/*<NewQueryPane/>*/}
            {/*<QueryPane editor = { queryPaneOptions }
                resultPane = {resultPaneOptions}/>*/}
            {<Preview/>}
    	  </Container>
      </Container>
    )
}

export default Query;
