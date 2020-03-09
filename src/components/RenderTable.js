import React, { useState, useCallback } from "react";
import history from '../utils/history';
import { stripDocFromUrl } from '../utils/extractStrings'
import styled from 'styled-components'
import { Container, Row, Col ,Button, Card, CardImg, CardText, CardBody, CardLink,
         CardTitle, CardSubtitle } from "reactstrap";
import DataTable from 'react-data-table-component';
import { SERVER_HOME_PAGE } from '../variables/pageLabels'
import { useGlobalState, setCurrentDB } from "../init/initializeGlobalState";
import { TERMINUS_CLIENT } from '../labels/globalStateLabels'
import ExpandedComponent from './ExpandedComponent'

const RenderTable = (props) => {
    const [onRowClicked, setSelectedRows] = useState([]);
    const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    let explandableRows = false;
    if (props.fromPage == SERVER_HOME_PAGE.page)
        explandableRows = true;

    let dBuf = props.dataProvider.columnData || [];

    // get datatable data and column
    let data = [];
    if(explandableRows) { // disable row expansion when db has no description
        data = dBuf.map(item => {
            let disabled = false;
            if (item['rdfs:comment'] == undefined) {
              disabled = true;
            }
            return { ...item, disabled };
        });
    }
    else data = props.dataProvider.columnData || [];

    let columns = props.dataProvider.columnConf || [];

    const handleChange = useCallback(state => {
        switch(props.fromPage){
            case SERVER_HOME_PAGE.page:
                var dbId = stripDocFromUrl(state['@id']);
                history.replace('db/' + dbId);
                dbClient.connectionConfig.setDB(dbId);
                break;
            default:
                console.log('RenderTable.js - Invalid page label')
        }
        setSelectedRows(state);
    }, [dbClient]);

    return (
        <div className = "container-fluid">
            <Card>
                <CardBody>
                    { explandableRows && <DataTable
                        columns = {columns}
                        data = {data}
                        onRowClicked = {handleChange}
                        pagination
                        striped
                        pointerOnHover
                        highlightOnHover
                        expandableRows
                        expandableRowDisabled={row => row.disabled}
                        responsive
                        expandableRowsComponent={<ExpandedComponent
                                                    fromPage={ props.fromPage }
                                                    dataProvider= { props.dataProvider }/>}/>}
                   { !(explandableRows) && <DataTable
                       columns = {columns}
                       data = {data}
                       onRowClicked = {handleChange}
                       pagination
                       striped
                       pointerOnHover
                       highlightOnHover
                       responsive/>}
                </CardBody>
            </Card>
        </div>
    )
}

export default RenderTable;
