import React, {useState, useEffect} from 'react'
import Loading from '../../components/Reports/Loading'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {DBContextObj} from '../../components/Query/DBContext'
import {Row, Col, Button} from "react-bootstrap" //replaced
import {WOQLQueryContainerHook} from '../../components/Query/WOQLQueryContainerHook'
import {JSONEditor} from "./JSONEditor"
import {TerminusDBSpeaks} from "../../components/Reports/TerminusDBSpeaks"

export const FrameViewer = ({doc, classframe, view, edit}) => {
    if(!(classframe && classframe['system:properties'])) return null
    const { woqlClient} = WOQLClientObj()
    let df = view.create(woqlClient)
    df.load(classframe['system:properties'], doc)
    //df.loadSchemaFrames(classframe['system:properties'], doc["@type"])
    //df.loadData(doc, doc["@type"])
    df.filterFrame(getRenderer)
    df.document.sortProperties()
    //if(edit) return <FrameEditor doc={doc} classframe={classframe} />
    return df.document.render() 
}

const getRenderer = (name, frame, args) => {
    const f = () => {
        return FrameRenderer(frame)
    }
    return f
}

const FrameRenderer = (frame) => {

    const renderValue = (frame) => {
        if(frame.isData()){
            return frame.get()
		}
		else {
			return FrameRenderer(frame) 			
		}
    }

    const renderProperty = (frame, p) => {
        let rows = []
        let labpart = <td rowspan={frame.values.length}>{frame.getLabel()}</td>
        for(var i = 0 ; i < frame.values.length; i++){
            if(i == 0){
                rows.push(<tr>
                    {labpart}
                    <td>{renderValue(frame.values[i])}</td>
                </tr>)
            }
            else {
                rows.push(<tr>
                    <td>{renderValue(frame.values[i])}</td>
                </tr>)
            }
        }
        return rows
    }


    const renderProperties = (frame) => {
        let props = []
        for(var p in frame.properties){
            let prows = renderProperty(frame.properties[p], p)
            props = props.concat(prows)
        }
        return props
    }

    return (
        <table border="1" width="100%">
            <thead>
                <tr><th colspan="2">{frame.subject() + ", " + frame.subjectClass()}</th></tr>
            </thead>
            <tbody>
                {renderProperties(frame)}
            </tbody>
        </table>
    )
}


export const FrameEditor = ({doc, classframe, view}) => {
    return <JSONEditor
        dataProvider={JSON.stringify(classframe, false, 2)}
    />
}
