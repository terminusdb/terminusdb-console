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
import {SCHEMA_CLASSES_ROUTE} from '../../constants/routes'
import {Col, Row, Button} from "react-bootstrap" //replaced
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {GraphFilter} from './GraphFilter'
import {TERMINUS_ERROR, TERMINUS_TABLE} from '../../constants/identifiers'
import {ControlledTable} from '../Tables/ControlledTable'
import { FrameViewer } from '@terminusdb/terminusdb-react-components';
import {BiArrowBack, BiNetworkChart} from "react-icons/bi"


export const Classes = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [query, setQuery] = useState(getClassQuery(props.graph))
    const [report, setReport] = useState()
    const [empty, setEmpty] = useState(false)
    const [frame, setFrame] = useState(false)
    const { woqlClient} = WOQLClientObj()
    
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

    
    const getClassFrame = (docType) => {
        woqlClient.getClassFrame(docType).then((cf) => setFrame(cf))
    }

    const showClass = (row) => {
        if(row && row.original) {
            let cid = row.original["Class ID"]
            if(cid) getClassFrame(cid)
        }
    }

    const tabConfig= TerminusClient.View.table();
    tabConfig.column_order("Class ID", "Class Name", "Parents", "Children", "Abstract", "Description")
    tabConfig.column("Abstract").minWidth(50).width(80)
    tabConfig.column("Parents", "Children", "Description").width(200)
    tabConfig.pager("remote")
    tabConfig.pagesize(10)
    tabConfig.row().click(showClass)

    const docview = TerminusClient.View.document();
    docview.selectDocument = getClassFrame

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
            {!frame && 
                <ControlledTable 
                    limit={tabConfig.pagesize()} 
                    query={query} 
                    view={tabConfig} 
                />
            }
            {frame && <>
                <GoBackIcon onClose={function(){setFrame()}} />
                <FrameViewer 
                    classframe={frame}
                    mode="view" 
                    view={docview} 
                    type="table" 
                    client={woqlClient}
                />            
            </>}
        </div>
    )
}


export const GoBackIcon = ({onClose}) => {
    return <span onClick={onClose} style={{fontSize: "2em"}}>
        <span className="d-nav-icons" title={"Back to Class List"}>
            <BiArrowBack className="db_info_icon_spacing"/>
        </span>
    </span>
}