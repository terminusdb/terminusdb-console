import React, { useState, useEffect } from "react";
import { Container, Row, Col, Jumbotron,
		Button,Form,FormGroup,Label,Input,FormText,Collapse } from "reactstrap";
import Loading from "../../components/Loading";
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import TerminusClient from '@terminusdb/terminus-client';
import { HistoryNavigator } from '../../components/HistoryNavigator/HistoryNavigator'
import NavBar from '../../components/NavBar';
import { TableComponent } from '@terminusdb/terminus-react-table';


const DocumentView = (props) => {
    const [queryResults, setQueryResults] = useState();
    const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    const [activeQuery, setActiveQuery] = useState();

    useEffect(() => {
        const q = TerminusClient.WOQL.limit(50, TerminusClient.WOQL.lib().documentMetadata()) 
        dbClient.query(q).then((cresults) => {
            setQueryResults(cresults)
        })    
    }, []);



    function headChanged(){}

    return (
        <Container fluid className="h-100 pl-0 pr-0">
          <NavBar/>
            <Container className="flex-grow-1">
                <Col>
                  <div className="sch-disp">
                      <HistoryNavigator onHeadChange={headChanged} />
                  </div>
                  <TableComponent />
              </Col>

            </Container>
        </Container>
    )
}

export default DocumentView