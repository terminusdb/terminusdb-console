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
import {WOQLEditorControlled, WOQLGraph, ControlledQueryHook} from '@terminusdb/terminusdb-react-components'
import {WOQLClientObj} from '../../init/woql-client-instance'
import Loading from '../../components/Reports/Loading'
import {CANCEL_EDIT_BUTTON, EDIT_DOCUMENT_BUTTON, UPDATE_JSON_BUTTON, COMMIT_PLACEHOLDER, GO_BACK,
    SUBMIT_INPUT_LABEL, DOCUMENT_VIEW_TITLE, TABLE_VIEW_TITLE, LINKS_VIEW_TITLE, JSON_VIEW_TITLE, DELETE_DOCUMENT_BUTTON} from "../document/constants.document"
import {BiLink, BiFile, BiTable} from "react-icons/bi"
import {VscJson} from "react-icons/vsc"
import {RiDeleteBin5Line} from "react-icons/ri"

export const Properties = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [query, setQuery] = useState(getPropertiesQuery(props.graph))
    const [report, setReport] = useState()
    const [myview, setMyView] = useState("table")
    const { woqlClient} = WOQLClientObj()

    const showGraph = () => setView("graph")
    const showTable = () => setView("table")

    useEffect(() => {
        if (
            props.graph &&
            (!filter || filter.id != props.graph.id || filter.type != props.graph.type)
        ) {
            if (filter) setQuery(getPropertiesQuery(props.graph))
            setFilter(props.graph)
        }
    }, [props.graph])

    function setView(which){
        setMyView(which)
        setQuery(getPropertiesQuery(props.graph, which))
    }


    function getPropertiesQuery(gfilter, which) {
        let gstr = gfilter.type + '/' + gfilter.id
        if(which && which == "graph"){
            return TerminusClient.WOQL.and(
                TerminusClient.WOQL.lib().properties(false, false, gstr),
                TerminusClient.WOQL.quad("v:Property Domain", "label", "v:Domain Name", gstr)
                .opt().quad("v:Property Range", "label", "v:Range Name", gstr)
            )
        }
        return TerminusClient.WOQL.lib().properties(false, false, gstr)
    }

    const tabConfig= TerminusClient.View.table();
    const graphConfig= TerminusClient.View.graph();
    graphConfig.show_force(true)
    //graphConfig.height(800).width(1000)
    graphConfig.edges(["Property Domain", "Property Range"]);
    graphConfig.edge("Property Domain", "Property Range").text("Property ID")
    graphConfig.node("Property Range").size(30).color([180, 220, 250]).text("Range Name").icon({label: true, color: [0,0,0]})
    graphConfig.node("Property Domain").size(30).text("Domain Name").icon({label: true, color: [0,0,0]})
    graphConfig.node("Property Range").v("Property Type").in("Data").hidden(true)
    graphConfig.node("Property Range").collisionRadius(100)
    //woqlGraphConfig.node("Subject").size(20).color([180, 220, 250]).text("Predicate")
    //woqlGraphConfig.node("Object").size(30).color([0, 220, 250]).text("Predicate")
    //woqlGraphConfig.node("Subject").text("Predicate")
    //woqlGraphConfig.node("B").text("v:BLabel")
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
                <Col key='m1' md={8} className="schema-toolbar-title">
                    Objects have properties with different range types
                </Col>
                <Col md={1} className={TOOLBAR_CSS.graphCol}>
                <span>
                    <span onClick={showTable} className="d-nav-icons" title={TABLE_VIEW_TITLE}>
                        <BiTable className={"db_info_icon_spacing" + (myview == "table" ? " tdb__panel__button--selected document_view_selected" : " document_view_unselected")}/>
                    </span>
                    <span onClick={showGraph} className="d-nav-icons" title={JSON_VIEW_TITLE}>
                        <VscJson className={"db_info_icon_spacing" + (myview == "graph" ? " tdb__panel__button--selected document_view_selected" : " document_view_unselected")}/>
                    </span>
                </span>
                </Col>
                <Col md={3} className={TOOLBAR_CSS.graphCol}>
                     {GraphFilter(SCHEMA_PROPERTIES_ROUTE, filter, props.onChangeGraph)}
                </Col>
            </Row>
            {myview == "table" &&            
                <ControlledTable 
                    limit={tabConfig.pagesize()} 
                    query={query} 
                    view={tabConfig} 
                />
            }
            {myview == "graph" && 
                <ControlledGraph query={query} view={graphConfig} />
            }
        </div>
    )
}

export const ControlledGraph = ({query, view}) => {
    const [loaded, setLoaded] = useState(false)
    const { woqlClient} = WOQLClientObj()

    const {
        updateQuery,
        changeOrder,
        changeLimits,
        woql,
        result,
        limit,
        start,
        orderBy,
        loading,
        rowCount,
    } = ControlledQueryHook(woqlClient, query, false, 200)


    useEffect(() => {
        if(query && woql){
            if(loaded){
                updateQuery(query)
            }
            else {
                setLoaded(true)
            }
        }
    }, [query])

    function getProvider(result){
        const rt = new TerminusClient.WOQLResult(result,query);
        let viewer = view.create(null);
        viewer.setResult(rt);
        return viewer;    
    }

    function isEmpty(res){
        if(start == 0 && res.rows == 0) return true
        return false
    }

    if(result && view && view.prefixes) result.prefixes = view.prefixes

    return (
        <div className="tdb__loading__parent">
            {loading && 
                <Loading type={TERMINUS_TABLE} />
            }
            {result && result.status != 200 &&  
                <TerminusDBSpeaks report={result} />
            }
            {result && result.status == 200 && isEmpty(result) && 
                <EmptyResult report={result} />
            }
            {result && result.status == 200 && !isEmpty(result) &&
                <WOQLGraph 
                    config={view} 
                    dataProvider={getProvider(result)} 
                    query={query} 
                    updateQuery={updateQuery}
                />
        }
    </div>
)
}