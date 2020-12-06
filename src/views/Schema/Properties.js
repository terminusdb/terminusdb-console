import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {
    TAB_SCREEN_CSS,
    TOOLBAR_CSS
} from './constants.schema'
import {EmptyResult} from '../../components/Reports/EmptyResult'
import {SCHEMA_PROPERTIES_ROUTE} from '../../constants/routes'
import {Col, Row, Button} from "reactstrap"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {GraphFilter} from './GraphFilter'
import {ControlledTable} from '../Tables/ControlledTable'
import {TERMINUS_TABLE} from '../../constants/identifiers'


export const Properties = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [query, setQuery] = useState(getPropertiesQuery(props.graph))
    const [report, setReport] = useState()

    useEffect(() => {
        if (
            props.graph &&
            (!filter || filter.id != props.graph.id || filter.type != props.graph.type)
        ) {
            if (filter) setQuery(getPropertiesQuery(props.graph))
            setFilter(props.graph)
        }
    }, [props.graph])


    function getPropertiesQuery(gfilter) {
        let gstr = gfilter.type + '/' + gfilter.id
        return TerminusClient.WOQL.lib().properties(false, false, gstr)
    }

    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Property ID", "Property Name", "Property Domain",
        "Property Range", "Property Type", "Property Description")
    tabConfig.pager("remote")
    tabConfig.pagesize(10)
    tabConfig.column("Property Name").header("Name").width(100)
    tabConfig.column("Property Domain").header("Domain").width(100)
    tabConfig.column("Property Range").header("Range").width(100)
    tabConfig.column("Property Type").header("Type").width(60)
    tabConfig.column("Property Description").header("Description").width(300)

    return (
        <div className={TAB_SCREEN_CSS}>
            <Row className={TOOLBAR_CSS.container}>
                <Col key='m1' md={9} className="schema-toolbar-title">
                    Properties relate objects to data about the object and to other objects
                </Col>
                <Col md={3} className={TOOLBAR_CSS.graphCol}>
                     {GraphFilter(SCHEMA_PROPERTIES_ROUTE, filter, props.onChangeGraph)}
                </Col>
            </Row>           
            <ControlledTable 
                limit={tabConfig.pagesize()} 
                query={query} 
                view={tabConfig} 
            />
        </div>
    )
}
