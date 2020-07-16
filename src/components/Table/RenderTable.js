import React, {useState, useCallback} from 'react'
import DataTable from 'react-data-table-component'
import ExpandedComponent from './ExpandedComponent'
import {goDBHome} from '../Router/ConsoleRouter'

const RenderTable = (props) => {
    const [onRowClicked, setSelectedRows] = useState([])
    let explandableRows = false
    let always = false
    let dBuf = props.dataProvider.columnData || []

    // get datatable data and column
    let data = []
    if (explandableRows) {
        // disable row expansion when db has no description
        data = dBuf.map((item) => {
            let disabled = false
            if (item['rdfs:comment'] == undefined) {
                disabled = true
            }
            return {...item, disabled}
        })
    } else data = props.dataProvider.columnData || []

    let columns = props.dataProvider.columnConf || []

    const handleChange = useCallback(
        (state) => {
            switch (props.fromPage) {
                case 'home':
                    var dbId = state['id'] || state['Database ID']
                    var organization = state['organization'] || state['Organization']
                    goDBHome(dbId, organization)
                    break
                default:
                    console.log('RenderTable.js - Invalid page label')
            }
            setSelectedRows(state)
        },
        [always],
    )

    return (
        <>
            {explandableRows && (
                <DataTable
                    columns={columns}
                    data={data}
                    onRowClicked={handleChange}
                    pagination
                    striped
                    pointerOnHover
                    highlightOnHover
                    expandableRows
                    expandableRowDisabled={(row) => row.disabled}
                    responsive
                    expandableRowsComponent={
                        <ExpandedComponent
                            fromPage={props.fromPage}
                            dataProvider={props.dataProvider}
                        />
                    }
                />
            )}
            {!explandableRows && (
                <DataTable
                    columns={columns}
                    data={data}
                    onRowClicked={handleChange}
                    pagination
                    striped
                    pointerOnHover
                    highlightOnHover
                    responsive
                />
            )}
        </>
    )
}

export default RenderTable
