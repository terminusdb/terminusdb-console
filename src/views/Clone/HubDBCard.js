import React, {useState,Fragment} from 'react'

export const HubDBCard = ({meta, onAction, report}) => {
    let [mode, setMode] = useState()
    let [bump, setBump] = useState(0)

    function showSubscreen(ss){
        if(ss == "delete") setBump(bump+1)
        setMode(ss)
    }

    function onEditSuccess(){
        meta.action = "load"
        onAction(meta)
        setMode()
    }

    function onFork(doc){
        setMode()
        onAction(doc)
    }

    function onCancel(){
        setMode()
    }

    return (<Fragment>
        <Row key='r7' className='database-summary-listing database-listing-line'>
            <CloneImagePanel meta={meta} />
            <span className='database-main-content'>
                <Row key='r3'>
                    <HubTitle meta={meta} onAction={onAction}/>
                </Row>
                <HubCredits meta={meta} onAction={onAction}/>
                <HubDescription meta={meta} />
            </span>
            <span className='database-main-actions'>
                <HubStatus meta={meta} onAction={showSubscreen}/>
            </span>
        </Row>
        {report &&
            <Row className="generic-message-holder">
                    <TerminusDBSpeaks report={report} />
            </Row>
        }
        <Row key="r88" className='hubdb-main-screen' />
        {(mode == "clone") &&
             <HubClonePage meta={meta} onAction={onAction} onCancel={onCancel}/>
        }
        {(mode == "fork") &&
             <HubForkPage meta={meta} onAction={onFork} onCancel={onCancel}/>
        }
        {(mode == "delete") &&
            <DeleteHubDB meta={meta} isOpen={bump}/>
        }
        {(mode == "edit") &&
            <EditHubPage meta={meta} onSuccess={onEditSuccess}/>
        }
    </Fragment>)
}

export const HubTitle = ({meta, onAction}) => {
    let str = meta.label || '['+ meta.id+']'
    return (
        <span>
            <span className='database-listing-title-row'>
                <span key='a' className="database-listing-title-nolink">{str}</span>
            </span>
        </span>
    )
}

export const CloneImagePanel = ({meta, onAction}) => {
    let icon = meta.icon
    let goDB = onAction ? function(){
        meta.action = "load"
        onAction(meta)
        goHubPage(meta.organization, meta.id)
    } : undefined

    let clickcss = onAction ? " clickable-image-panel" : ""

    if(!icon) {
        if(meta.organization_icon) icon = meta.organization_icon
        else icon = HUBDB
    }
    let title = `Database ${meta.id} in organization ${meta.organization}`
    let vi = validURL(icon)
    return (
        <span title={title} className={'dbcard-control-panel' + clickcss} onClick={goDB} >
        {vi &&
            <img className='dbcard-image' src={icon}/>
        }
        {!vi &&
            <i className={'dbcard-icon ' + icon} />
        }
        </span>
    )
}

export const HubCredits = ({meta, onAction}) => {
    return (<Fragment>
        <div className="dbcard-creditline">
            <CloneProductionCredits  key='ac' meta={meta} onAction={onAction}/>
            <CloneRoleCredits key='ade' meta={meta} />
            <DBPrivacy key='ad' meta={meta} />
            <DBBranches key='abc' meta={meta} type="full"/>
            <DBSchema key='dbfe' meta={meta}/>
            {!meta.created &&
                <DBEmpty />
            }
        </div>
        <div className="dbcard-sub-creditline">
            {meta.created &&
                <DBCreated ts={meta.created} type="full" />
            }
            {meta.updated &&
                <DBLastCommit meta={meta} />
            }
        </div>
    </Fragment>
    )
}

