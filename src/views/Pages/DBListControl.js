import React, {useState, useEffect} from "react";
import { CloneDB } from '../../components/Query/CollaborateAPI'
import {DBList} from '../Tables/DBList'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {useAuth0} from '../../react-auth0-spa'
import {goDBPage, goDBHome} from "../../components/Router/ConsoleRouter"
import { TerminusDBSpeaks } from "../../components/Reports/TerminusDBSpeaks";
import { TERMINUS_INFO, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_SUCCESS } from "../../constants/identifiers";
import { CLONE_URL_FORM, LIST_LOCAL, LIST_REMOTE, CLONE} from "./constants.pages"
import {TCForm} from '../../components/Form/FormComponents'


export const DBListControl = ({list, className, user, type}) => {
    const { woqlClient, reconnectServer } = WOQLClientObj()
    const { getTokenSilently } = useAuth0();
    
    let [special, setSpecial] = useState(false)

    function setAction(act, db){
        if(act == 'pull' || act == 'push'){
            goDBPage(db.id, woqlClient.user_organization(), "synchronise")
        }
        if(act == 'share'){
            setSpecial({action:act, meta: db})
        }
        if(act == 'clone_url'){
            if(db.remote_url.substring(0, 7) == "http://" || db.remote_url.substring(0, 8) == "https://"){
                db.id = db.remote_url.substring(db.remote_url.lastIndexOf("/")+1)
                if(woqlClient.server() == db.remote_url.substring(0, woqlClient.server().length)){
                    let edb = woqlClient.get_database(db.id, woqlClient.user_organization())
                    db.label = edb.label
                    db.comment = edb.comment   
                }
                else {
                    db.label = db.id
                    db.comment = ""
                }
                act = 'clone'    
            }
            else return "You must supply a valid URL"
        }
        else if(act == 'clone'){
            db.remote_url = db.remote_record.url
        }
        if(act == 'clone'){
            CloneDB(db, woqlClient, getTokenSilently)
            .then(() => {
                setReport({status: TERMINUS_SUCCESS, message: "Successfully Cloned Database"})
                reconnectServer().then(() => goSeverHome()) 
            })
        }
    }

    let message = ""
    if(type == 'clone'){
        message = CLONE
    }
    else {
        message = user.logged_in ?  LIST_REMOTE : LIST_LOCAL 
    }

    let report = {status: TERMINUS_INFO,  message: message}

    if(!list) return null
    return (<>
            <span className="database-list-intro">
                <TerminusDBSpeaks report={report} />
            </span>
            {special && 
                <DBList list={[special.meta]} className={className} user={user}/>
            }
            {!special &&
                <DBList list={list} className={className} user={user} onAction={setAction}/>            
            }
            {type == 'clone' && 
                <CloneURL onClone={setAction}/>                        
            }
        </>
    )
}

export const CloneURL = ({onClone}) => {
    let fields = CLONE_URL_FORM.fields
    let [report, setReport] = useState()
    function onSubmit(meta) {
        let err = onClone('clone_url', {remote_url: meta.url})
        if(err){
            setReport({status: TERMINUS_WARNING, message: err})
        }
    }

    let buttons = CLONE_URL_FORM.buttons    
    return (<>
            <TCForm
                onSubmit={onSubmit}
                report={report}
                layout={[1]}
                noCowDucks
                fields={fields}
                buttons={buttons}
            />
        </>
    )
}        


