import React, {useState, useEffect} from 'react'
import TerminusClient from '@terminusdb/terminusdb-client'
import {
    TAB_SCREEN_CSS
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
import {TOOLBAR_CSS, GRAPH_VIEW_TITLE, TABLE_VIEW_TITLE, LINKS_VIEW_TITLE, JSON_VIEW_TITLE, DELETE_DOCUMENT_BUTTON} from "../Document/constants.document"
import {BiLink, BiNetworkChart, BiTable} from "react-icons/bi"
import {VscJson} from "react-icons/vsc"
import {RiDeleteBin5Line} from "react-icons/ri"
import {ControlledGraph} from "../Tables/ControlledGraph"
import { FrameViewer } from '@terminusdb/terminusdb-react-components';

export const Properties = (props) => {
    const [filter, setFilter] = useState(props.graph)
    const [query, setQuery] = useState(getPropertiesQuery(props.graph))
    const [report, setReport] = useState()
    const [myview, setMyView] = useState("table")
    const { woqlClient} = WOQLClientObj()
    const [frame, setFrame] = useState(false)

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
        let WOQL = TerminusClient.WOQL
        if(which && which == "graph"){
            return WOQL.and(
                WOQL.lib().properties(false, false, gstr),
                WOQL.quad("v:Property Domain", "label", "v:Domain Name", gstr)
                .or(
                    WOQL.quad("v:Property Domain", "system:tag", "system:abstract", gstr).eq("v:Abstract Domain", "Yes"),
                    WOQL.and(
                        WOQL.not().quad("v:Property Domain", "system:tag", "system:abstract", gstr),
                        WOQL.eq("v:Abstract Domain", "No")
                    )
                )
                .or(
                    WOQL.sub("system:Document", "v:Property Domain").eq("v:Document Domain", "Yes"),
                    WOQL.and(
                        WOQL.not().sub("system:Document", "v:Property Domain"),
                        WOQL.eq("v:Document Domain", "No")
                    )
                )  
                .opt().quad("v:Property Range", "label", "v:Range Name", gstr)	
                    .or(
                        WOQL.quad("v:Property Range", "system:tag", "system:abstract", gstr).eq("v:Abstract Range", "Yes"),
                        WOQL.and(
                            WOQL.not().quad("v:Property Range", "system:tag", "system:abstract", gstr),
                            WOQL.eq("v:Abstract Range", "No")
                        )
                    )
                    .or(
                        WOQL.sub("system:Document", "v:Property Range").eq("v:Document Range", "Yes"),
                        WOQL.and(
                            WOQL.not().sub("system:Document", "v:Property Range"),
                            WOQL.eq("v:Document Range", "No")
                        )
                    )
                    .or(
                        WOQL.quad("v:Property Range", "owl:oneOf", "v:Any", gstr).eq("v:Enum Range", "Yes"),
                        WOQL.and(
                            WOQL.not().quad("v:Property Range", "owl:oneOf", "v:Any", gstr),
                            WOQL.eq("v:Enum Range", "No")
                        )
                    )
            )
        }
        return TerminusClient.WOQL.lib().properties(false, false, gstr)
    }

    const graphConfig= TerminusClient.View.graph();
    graphConfig.show_force(true)
    graphConfig.edges(["Property Domain", "Property Range"]);
    graphConfig.edge("Property Domain", "Property Range").size(2).text("Property Name").arrow({width: 50, height: 20})
        .icon({label: true, color: [109,98,100], size: 0.8})
    graphConfig.node("Property Range").size(30).text("Range Name").color([150,233,151]).icon({label: true, color: [0,0,0]})
    graphConfig.node("Property Domain").size(30).text("Domain Name").color([150,233,151]).icon({label: true, color: [0,0,0]})
    graphConfig.node("Property Range").v("Abstract Range").in("Yes").color([189,248,190])
    graphConfig.node("Property Domain").v("Abstract Domain").in("Yes").color([189,248,190])
    graphConfig.node("Property Range").v("Enum Range").in("Yes").color([23,190,207])
    graphConfig.node("Property Range").v("Property Type").in("Data").hidden(true)
    graphConfig.node("Property Domain").collisionRadius(100)
    graphConfig.node("Property Range").v("Document Range").in("Yes").color([255,178,102])
    graphConfig.node("Property Domain").v("Document Domain").in("Yes").color([255,178,102])
    graphConfig.node("Property Range").v("Document Range").in("Yes").v("Abstract Range").in("Yes").color([252,219,186])
    graphConfig.node("Property Domain").v("Document Domain").in("Yes").v("Abstract Domain").in("Yes").color([252,219,186])
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

    
    const getClassFrame = (docType) => {
        woqlClient.getClassFrame(docType).then((cf) => setFrame(cf))
    }

    const showClass = (cid) => {
        if(cid) getClassFrame(cid)
    }

    const docview = TerminusClient.View.document();
    docview.selectDocument = getClassFrame

    return (
        <div className={TAB_SCREEN_CSS}>
            <Row className={TOOLBAR_CSS.container}>
                <Col key='m1' md={7} className="schema-toolbar-title">
                    Objects have properties with different range types
                </Col>                
                <Col md={3} className={TOOLBAR_CSS.graphCol}>
                     {GraphFilter(SCHEMA_PROPERTIES_ROUTE, filter, props.onChangeGraph)}
                </Col>
                <Col md={2} className={TOOLBAR_CSS.graphCol}>
                    <span style={{fontSize: "2em"}}>
                        <span onClick={showTable} className="d-nav-icons" title={TABLE_VIEW_TITLE}>
                            <BiTable className={"db_info_icon_spacing" + (myview == "table" ? " tdb__panel__button--selected document_view_selected" : " document_view_unselected")}/>
                        </span>
                        <span onClick={showGraph} className="d-nav-icons" title={GRAPH_VIEW_TITLE}>
                            <BiNetworkChart className={"db_info_icon_spacing" + (myview == "graph" ? " tdb__panel__button--selected document_view_selected" : " document_view_unselected")}/>
                        </span>
                    </span>
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
                <ControlledGraph onClick={showClass} query={query} view={graphConfig} />               
            }
             {myview == "graph" && frame &&
                    <FrameViewer 
                        classframe={frame}
                        mode="view" 
                        view={docview} 
                        type="table" 
                        client={woqlClient}
                    />            
                }
        </div>
    )
}

