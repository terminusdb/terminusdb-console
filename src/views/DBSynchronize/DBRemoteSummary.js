import {Row, Col} from "reactstrap"
import React from 'react'
import { isHubURL, isLocalURL } from '../../components/Query/CollaborateAPI'
import { AiOutlineInfoCircle } from 'react-icons/ai'


/**
 * Component which provides a summary of the situation with respect to the remotes of a database
 */
export const DBRemoteSummary = ({woqlClient, repos, onCreate, onShare, onLogin}) => {
    let meta = woqlClient.get_database()
    let user = woqlClient.user()

    function categorize(repos){
        let hubs = []
        let locals = []
        let others = []
        for(var k in repos){
            if(repos[k].title != "local"){
                if(isHubURL(repos[k].url)) hubs.push(repos[k])
                else if(isLocalURL(repos[k].url, woqlClient)) locals.push(repos[k])
                else others.push(repos[k])
            }
        }
        return {hub: hubs, local: locals, other: others}
    }

    let cats = categorize(repos)

    let tots = cats.hub.length + cats.local.length + cats.other.length
    let share_to_hub = (cats.hub.length == 0)
    let intro_text
    if(tots == 0){
        intro_text = "This database is local only, it is associated with no remote databases"
    }
    else if(tots == 1 && cats.hub.length == 1){
        intro_text = "This database is connected to database on Terminus Hub"
    }
    else if(tots == 1 && cats.local.length == 1){
        intro_text = "This database is connected to a local database"
    }
    else if(tots == 1 && cats.other.length == 1){
        intro_text = "This database is connected to a remote database"
    }
    else {
        intro_text = `This database is connected to ${tots} remotes`
    }

    if(!meta || !repos) return null;

    let showSave = (user && user.logged_in)
    let showLogin = (!(user && user.logged_in))

    return (
        <Row>
            <Col md={6}>
                <AiOutlineInfoCircle color={"#787878"} className={"intro_text_icon"}/><span className="intro_text">{intro_text}</span>
            </Col>
            <Col md={4}>
                {share_to_hub &&
                    <span>
                    {showSave &&
                        <button type="submit" onClick={onShare} className="tdb__button__base tdb__button__base--green">
                            Save to Terminus Hub
                        </button>
                    }
                    {showLogin &&
                        <button type="submit" onClick={onLogin} className="tdb__button__base tdb__button__base--green">
                            Login to Terminus Hub to Save
                        </button>
                    }
                    </span>
                }
            </Col>
            <Col md={2} className="remote-summary-action">
                <button type="submit" onClick={onCreate} className="tdb__button__base tdb__button__base--bgreen">
                    Add Remote
                </button>
            </Col>
        </Row>
    )
}
