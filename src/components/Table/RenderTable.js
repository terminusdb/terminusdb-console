import React, { useState, useCallback } from "react";
import history from '../../utils/history';
import { stripDocFromUrl } from '../../utils/extractStrings'
import styled from 'styled-components'
import { Container, Row, Col ,Button } from "reactstrap";
import DataTable from 'react-data-table-component';
import { SERVER_HOME_PAGE } from '../../variables/pageLabels'
import ExpandedComponent from '../ExpandedComponent'

const RenderTable = (props) => {
    const [onRowClicked, setSelectedRows] = useState([]);
    let explandableRows = false;
    let always = false
    if (props.fromPage == SERVER_HOME_PAGE.page)
        explandableRows = false;

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
                var dbId = state['db'];
                var account = state['account'];
                //dbClient.connectionConfig.clearCursor()
                //dbClient.db(dbId);
                //dbClient.account(account);
                if(dbId == "terminus") history.replace('/db/' + dbId + "/");
                else history.replace('/db/' + account + "/" + dbId + "/");
                break;
            default:
                console.log('RenderTable.js - Invalid page label')
        }
        setSelectedRows(state);
    }, [always]);

    return (
              <>
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
            </>
    )
}

export default RenderTable;
