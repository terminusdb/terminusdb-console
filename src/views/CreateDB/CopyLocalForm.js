import React, {useState} from 'react'
import {useAuth0} from '../../react-auth0-spa'
import Loading from '../../components/Reports/Loading'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {
    TERMINUS_SUCCESS,
    TERMINUS_ERROR,
    TERMINUS_INFO,
    TERMINUS_COMPONENT,
} from '../../constants/identifiers'
import {COPY_LOCAL_FORM, COPY_DB_DETAILS_FORM} from './constants.createdb'
import {goDBHome, goServerHome} from '../../components/Router/ConsoleRouter'
import {APIUpdateReport} from '../../components/Reports/APIUpdateReport'
import {TCForm, TCSubmitWrap} from '../../components/Form/FormComponents'
import {Container, Row} from 'reactstrap'
import {UnstableWarning} from '../../components/Reports/UnstableWarning'

export const CopyLocalForm = () => {
    const {woqlClient, reconnectServer} = WOQLClientObj()
    let dbl = getDBList()

    const {loading, user} = useAuth0()
    const [localDBs, setLocalDBs] = useState(dbl)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [report, setReport] = useState({
        status: TERMINUS_INFO,
        message: COPY_LOCAL_FORM.intro,
    })
    const [sourceID, setSourceID] = useState()
    const [details, setDetails] = useState({})
    const [newID, setNewID] = useState()
    let update_start = Date.now()

    let basicInfo = {}
    let fields = COPY_LOCAL_FORM.fields

    //build values and options from database options
    COPY_LOCAL_FORM.fields.map((item, index) => {
        basicInfo[item.id] = item.value || ''
        if (item.id == 'dbsource') fields[index].inputElement.options = getDBOptions(dbl)
    })

    function getDBOptions(dblist) {
        return dblist.map((item) => {
            return {
                value: `${item.organization}/${item.id}`,
                label: item.label,
            }
        })
    }

    function getStarterTitle(orig) {
        let base = orig + ' Clone'
        let ntry = base
        let i = 1
        while (titleTaken(ntry)) {
            ntry = base + ' (' + i++ + ')'
        }
        return ntry
    }

    function titleTaken(ntitle) {
        let istaken = false
        localDBs.map((item) => {
            if (item.label == ntitle) istaken = true
        })
        return istaken
    }

    function getStarterDescription(orig) {
        return '(Local Clone) ' + orig
    }

    function getDBList() {
        return woqlClient.user_databases()
    }

    function loadDetailsForDB(dbid) {
        let parts = dbid.split('/')
        for (var i = 0; i < localDBs.length; i++) {
            if (localDBs[i].id == parts[1] && localDBs[i].organization == parts[0])
                return dbToForm(localDBs[i])
        }
        return {}
    }

    //translate from dblist json to form json
    function dbToForm(item) {
        return {
            dbid: `${item.organization}/${item.id}`,
            dbname: getStarterTitle(item.label),
            description: getStarterDescription(item.description),
        }
    }

    function onChangeBasics(field_id, value) {
        if (field_id == 'dbsource') {
            setDetails(loadDetailsForDB(value))
            setSourceID(value)
        } else if (field_id == 'newid') {
            setNewID(value)
        }
    }

    function onClone() {
        update_start = Date.now()
        setUpdateLoading(true)
        let sourceURL = woqlClient.server() + sourceID
        let src = {remote_url: sourceURL, label: details.dbname}
        if (details.description) src.comment = details.description
        let cClient = woqlClient.copy()
        let abc = cClient.local_auth()
        cClient.remote_auth(abc)
        cClient.organization(woqlClient.user_organization())
        return cClient
            .clonedb(src, newID)
            .then(() => {
                let message = `${COPY_LOCAL_FORM.cloneSuccessMessage} (db: ${sourceID})`
                let rep = {
                    message: message,
                    status: TERMINUS_SUCCESS,
                    time: Date.now() - update_start,
                }
                setReport(rep)
                afterCreate(newID, rep)
            })
            .catch((err) => {
                let message = `${COPY_LOCAL_FORM.cloneFailureMessage} (db: ${sourceID}) `
                setReport({error: err, status: TERMINUS_ERROR, message: message})
            })
            .finally(() => {
                setUpdateLoading(false)
            })
    }

    /**
     * Reloads database list by reconnecting and goes to the db home
     */
    function afterCreate(id, rep) {
        woqlClient.connect().then((result) => {
            goDBHome(id, woqlClient.user_organization(), rep)
        })
    }

    let buttons = COPY_LOCAL_FORM.buttons

    return (
        <>
            {(loading || updateLoading) && <Loading type={TERMINUS_COMPONENT} />}
            <UnstableWarning feature="Cloning Databases" />           
            <TCForm
                onSubmit={onClone}
                layout={[2]}
                noCowDucks
                onChange={onChangeBasics}
                report={report}
                fields={fields}
                buttons={buttons}
            />
            {sourceID && (
                <Container className={COPY_LOCAL_FORM.detailsWrapperClassName}>
                    <Row className={COPY_LOCAL_FORM.detailsHeaderClassName}>
                        {COPY_LOCAL_FORM.detailsHeader}
                    </Row>
                    <TCForm
                        layout={[2, 1]}
                        noCowDucks
                        fields={COPY_DB_DETAILS_FORM.fields}
                        values={details}
                    />
                </Container>
            )}
        </>
    )
}
