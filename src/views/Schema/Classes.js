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
import {ClassList} from '../Tables/ClassList'
import {SCHEMA_CLASSES_ROUTE} from '../../constants/routes'
import {Col, Row, Button} from "reactstrap"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {GraphFilter} from './GraphFilter'


export const Classes = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {ref, branch, graphs, prefixes} = DBContextObj()

    const [filter, setFilter] = useState(props.graph)
    const [updateQuery, report, qresult, woql, loading] = WOQLQueryContainerHook(
        woqlClient,
        getClassQuery(props.graph),
        branch,
        ref,
    )

    useEffect(() => {
        if (
            props.graph &&
            (!filter || filter.id != props.graph.id || filter.type != props.graph.type)
        ) {
            if (filter) updateQuery(getClassQuery(props.graph))
            setFilter(props.graph)
        }
    }, [props.graph])

    function getClassQuery(gfilter) {
        let gstr = gfilter.type + '/' + gfilter.id
        return TerminusClient.WOQL.limit(
            CLASSES_QUERY_LIMIT,
            TerminusClient.WOQL.lib().classes(null, null, gstr),
        )
    }

    return (
        <div className={TAB_SCREEN_CSS}>
            {loading && <Loading />}
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
            {(qresult && qresult.bindings && qresult.bindings.length > 0) && 
               <span className="graphs-listing">
                    <ClassList query={woql} result={qresult} updateQuery={updateQuery} prefixes={prefixes}/>
                </span>  
            }
            {(qresult && qresult.bindings && qresult.bindings.length == 0) &&
                <Row className="generic-message-holder">
                    <EmptyResult report={report} />
                </Row>
            } 
        </div>
    )
}

