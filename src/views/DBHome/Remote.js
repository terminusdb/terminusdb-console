/**
 * Controller application for branch creation form
 */
import React, {useState, useEffect} from 'react'
import {TERMINUS_COMPONENT, TERMINUS_ERROR, TERMINUS_SUCCESS} from '../../constants/identifiers'
import {Row, Col, Container} from "reactstrap"

export const DBRemoteSummary = ({woqlClient, repos, onCreate}) => {
    let meta = woqlClient.get_database()

    function onRefresh(){
        alert("here we have to refresh the local record")
    } 

    if(!meta || !repos) return null;
    return (
        <Row>
            <Col md={9}>
                halleluja
            </Col>
            <Col md={3}>
                <button type="submit" onClick={onRefresh} className="tdb__button__base tdb__button__base--green">
                    Refresh Local State
                </button>                
                <button type="submit" onClick={onCreate} className="tdb__button__base tdb__button__base--green">
                    Add Remote
                </button>                
            </Col>
        </Row>
    )
}

export const DBRemotes = ({woqlClient, repos}) => {
    let meta = woqlClient.get_database()
    if(!meta || !repos) return null;
    let remotes = []
    for(var rem in repos){
        if(rem != "local"){
            remotes.push(
                <DBRemote meta={repos[rem]} woqlClient={woqlClient} repos={repos} />
            )
        }
    }
    return (<span>These are the remotes {remotes}</span>)    
}

export const DBRemote = ({meta, repos}) => {
    console.log(meta)
    return (
        <Col>        
            <RemoteTitle title={meta.title} url={meta.url} />
            <div className="database-context-row detail-credits">
                <RemoteCredits meta={meta} />
            </div>      
        </Col>
    )
}


export const RemoteTitle = ({title, url, max, max_url}) => {
    let maxtitle = max || 40
    let maxurl = max_url || 100
    let str
    if(title && title.length > maxtitle){
        str =  title.substring(maxtitle -4) + " ..."
    }
    else str = title || ""
    let urlstr = ""
    if(url && url.length > maxurl){
        urlstr =  url.substring(maxurl - 4) + " ..."
    }
    else urlstr = url || ""
    let title_css = "database-title-remote"

    return (
        <span className='database-listing-title-row'>
            <span key='a' className={title_css + " database-listing-title"}>{str}</span>
            <span title={url}>{urlstr}</span>
        </span>
    )
}

export const RemoteCredits = ({meta}) => {
    return meta.title
}
