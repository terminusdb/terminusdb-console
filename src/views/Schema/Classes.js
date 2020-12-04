import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {
    FAILED_LOADING_SCHEMA_CLASSES,
    CLASSES_QUERY_LIMIT,
    TAB_SCREEN_CSS,
    TOOLBAR_CSS,
} from './constants.schema'
import {EmptyResult} from '../../components/Reports/EmptyResult'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {ControlledTable} from '../Tables/ControlledTable'
import {SCHEMA_CLASSES_ROUTE} from '../../constants/routes'
import {Col, Row, Button} from "reactstrap"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {GraphFilter} from './GraphFilter'
import {TERMINUS_TABLE} from '../../constants/identifiers'


export const Classes = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [query, setQuery] = useState(getClassQuery(props.graph))
    const [report, setReport] = useState()
    const [empty, setEmpty] = useState(false)
    useEffect(() => {
        if (
            props.graph &&
            (!filter || filter.id != props.graph.id || filter.type != props.graph.type)
        ) {
            if (filter) setQuery(getClassQuery(props.graph))
            setFilter(props.graph)
        }
    }, [props.graph])

    function getClassQuery(gfilter) {
        let gstr = gfilter.type + '/' + gfilter.id
        return TerminusClient.WOQL.lib().classes(null, null, gstr)
    }

    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Class ID", "Class Name", "Parents", "Children", "Abstract", "Description")
    tabConfig.column("Abstract").minWidth(50).width(80)
    tabConfig.column("Parents", "Children", "Description").width(200)
    tabConfig.pager("remote")
    tabConfig.pagesize(10)


    return (
        <div className={TAB_SCREEN_CSS}>
            <Row className={TOOLBAR_CSS.container}>
                <Col key='m1' md={9} className="schema-toolbar-title">
                    Classes define the permitted shapes of documents and data-objects stored in your database
                </Col>
                <Col md={3} className={TOOLBAR_CSS.graphCol}>
                     {GraphFilter(SCHEMA_CLASSES_ROUTE, filter, props.onChangeGraph)}
                </Col>
            </Row>
            <Row className="generic-message-holder">
                {(report && report.status) &&
                    <TerminusDBSpeaks report={report} />
                }
            </Row>

                <ControlledTable limit={tabConfig.pagesize()} query={query} view={tabConfig} onEmpty={setEmpty} onError={setReport} loadingType={TERMINUS_TABLE}/>
            {empty &&
                <Row className="generic-message-holder">
                    <EmptyResult report={report} />
                </Row>
            }
        </div>
    )
}
