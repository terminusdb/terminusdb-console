import React, { useState } from "react";
import { Container , Col, Button } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import NavBar from '../../components/NavBar';
import { RenderSnippet } from "../../components/RenderSnippet";
import { QUERY_PAGE } from "../../variables/pageLabels"
import { QueryEditor } from "./QueryEditor"
import { queryControls } from "../../variables/formLabels"
import Collapsible from 'react-collapsible';

const Query = (props) => {

  const { loading, user } = useAuth0();

  if (loading) return <Loading />;

 /* const NewQueryPane = (props) => {
     const [qp, setQp] = useState([0]);
      return <Collapsible trigger={"Query Pane - "}>
        <QueryEditor qpNumber={2}/>
      </Collapsible>

  }*/
  const QueryPane = (props) => {
      const {caption} = props;
      const {qp, setQp} = props.pstate;
      const [open, setOpen] = useState(true);
      return (<>
          <Collapsible
            trigger={"Query Pane - " + props.qpNumber}>
              {<QueryEditor qpNumber={props.qpNumber}/>}
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
     return qp.map(m => <QueryPane key={m}
                         qpNumber={m}
                         pstate={{qp, setQp}}/>
        );

  }

  return (
      <Container fluid className="h-100 pl-0 pr-0">
          <NavBar/>
    	  <Container className="flex-grow-1">
            <NewQueryPane/>
    	  </Container>
      </Container>
    )
}

export default Query;
