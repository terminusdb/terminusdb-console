import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {
    FAILED_LOADING_SCHEMA_CLASSES,
    PROPERTIES_QUERY_LIMIT,
    TAB_SCREEN_CSS,
    TOOLBAR_CSS
} from './constants.schema'
import {ComponentFailure} from '../../components/Reports/ComponentFailure.js'
import {EmptyResult} from '../../components/Reports/EmptyResult'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {PropertyList} from '../Tables/PropertyList'
import {SCHEMA_PROPERTIES_ROUTE} from '../../constants/routes'
import {PROPERTIES_TABLE_INFO_MSG} from './constants.schema'
import {TERMINUS_INFO} from '../../constants/identifiers'
import {Col, Row, Button} from "reactstrap"
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {GraphFilter} from './GraphFilter'



export const Properties = (props) => {
    const {woqlClient} = WOQLClientObj()
    const {branch, ref} = DBContextObj()
    const [filter, setFilter] = useState(props.graph)
    const [updateQuery, report, bindings, woql, loading] = WOQLQueryContainerHook(
        woqlClient,
        getPropertiesQuery(props.graph),
        branch,
        ref,
    )

    useEffect(() => {
        if (
            props.graph &&
            (!filter || filter.id != props.graph.id || filter.type != props.graph.type)
        ) {
            if (filter) updateQuery(getPropertiesQuery(props.graph))
            setFilter(props.graph)
        }
    }, [props.graph])

    function getPropertiesQuery(gfilter) {
        let gstr = gfilter.type + '/' + gfilter.id
        return TerminusClient.WOQL.limit(
            PROPERTIES_QUERY_LIMIT,
            TerminusClient.WOQL.lib().properties(false, false, gstr),
        )
    }
    return (
        <div className={TAB_SCREEN_CSS}>
            {loading && <Loading />}
            <Row className={TOOLBAR_CSS.container}>
                <Col key='m1' md={9} className="schema-toolbar-title">
                    Properties relate objects to data about the object and to other objects
                </Col>
                <Col md={3} className={TOOLBAR_CSS.graphCol}>
                     {GraphFilter(SCHEMA_PROPERTIES_ROUTE, filter, props.onChangeGraph)}
                </Col>
            </Row>            
            <Row className="generic-message-holder">
                {(report && report.status) && 
                    <TerminusDBSpeaks report={report} />
                }
            </Row>
            {(bindings && bindings.length > 0) && 
               <span className="graphs-listing">
                    <PropertyList query={woql} properties={bindings} updateQuery={updateQuery} />
                </span>  
            }
            {(!(bindings && bindings.length > 0)) &&
                <Row className="generic-message-holder">
                    <EmptyResult report={report} />
                </Row>
            } 
        </div>
    )
}


