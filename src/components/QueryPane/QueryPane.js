import React, {useState, useEffect, useMemo} from 'react'
import {QueryEditor} from './QueryEditor'
import {QueryLibrary} from './QueryLibrary'
import {ReportWrapper} from './ReportWrapper'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {Tabs, Tab} from 'react-bootstrap'
import {ResultQueryPane} from './ResultQueryPane'
import {WOQLEditorControlled, WOQLTable, ControlledQueryHook} from '@terminusdb/terminusdb-react-components'
import {QUERY_PANEL_TITLE, QUERY_EDITOR_LABEL} from './constants.querypane'
import {DBContextObj} from '..//Query/DBContext'
import TerminusClient from "@terminusdb/terminusdb-client"
import Loading from '../../components/Reports/Loading'
import { TERMINUS_TABLE } from '../../constants/identifiers'

/*
 * this is only the queryEditor you don't need to process result;
 */
export const QueryPane = ({query, className, resultView, startLanguage, queryText}) => {
    /*
     * maybe a copy of this
     */
    const [uwoql, setUpdateWOQL] = useState()
    const [updated, setUpdated] = useState(false)
    const [baseLanguage, setBaseLanguage] = useState(startLanguage || 'js')
    const [content, setContent] = useState(initcontent)
    const [qres, setQres] = useState()

    const [showLanguage, setShowLanguage] = useState(false)
    const [showContent, setShowContent] = useState('')
    //const [selectedTab, changeTab] = useState(0)
    const [selectedTab, changeTab] = useState('query')
    
    const [error, setError] = useState(false)
    const { woqlClient} = WOQLClientObj()
    const {updateBranches, branch, ref, consoleTime} = DBContextObj()

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
    } = ControlledQueryHook(woqlClient, query, false, 20)

    useEffect(() => {
        if(woql && !woql.containsUpdate()){
            let nwoql = TerminusClient.WOQL.query().json(woql.json())
            updateQuery(nwoql)
        }
    }, [branch, ref])

    const tabConfig= TerminusClient.View.table();
    tabConfig.pager("remote")
    tabConfig.pagesize(20)
    /*
     *onChange will be update
     */
    let initcontent = queryText || ''

    const [disabled] = useMemo(() => {
        if (result && !result.error) {
            changeTab("result")
            return [{}]
        } else return [{disabled:true}]
    }, [result])

    const onSelect = (key) => {
        changeTab(key)
    }

    const updateWOQL = (q, commitMsg) => {
        if(consoleTime && q.containsUpdate()){
            setError({message: "You cannot update historical states"})
        }
        else {
            if(woql){
                if(orderBy){
                    changeOrder()
                }
                if(limit != 20 || start) changeLimits(20, 0)
            }
            updateQuery(q, commitMsg)
        }
    }

    //
    const errorObj =
        error === false
            ? {currentReport: result}
            : {
                  type: 'warning',
                  message: `${QUERY_EDITOR_LABEL.syntaxErrorMessage} ${error.message}`,
              }
    const errorChild =
        error === false ? (
            ''
        ) : (
            <>
                {QUERY_EDITOR_LABEL.syntaxErrorMessage}{' '}
                <span className="report__text--bold">{error.message}</span>
            </>
        )
    return (
        <>
          
            <ReportWrapper {...errorObj}>{errorChild}</ReportWrapper>

            <Tabs activeKey={selectedTab} onSelect={onSelect} id="query_tabs">
                <Tab eventKey="query" label={QUERY_PANEL_TITLE} title={QUERY_PANEL_TITLE}>
                    {loading &&
                        <Loading type={TERMINUS_TABLE} />
                    }
                    <QueryEditor
                        setMainError={setError}
                        mainError={error}
                        baseLanguage={baseLanguage}
                        setBaseLanguage={setBaseLanguage}
                        content={content}
                        saveContent={setContent}
                        showLanguage={showLanguage}
                        setShowLanguage={setShowLanguage}
                        showContent={showContent}
                        setShowContent={setShowContent}
                        editable={true}
                        query={woql}
                        updateQuery={updateWOQL}
                        languages={['js', 'json']}
                    >
                        <QueryLibrary library="editor" />
                    </QueryEditor>
                </Tab>
                <Tab eventKey="result" label="Result Viewer" title="Result Viewer" {...disabled}>
                    <ResultQueryPane
                        result={result}
                        setError={setError}
                        query={woql}
                        limit={limit}
                        start={start}
                        orderBy={orderBy}
                        loading={loading}
                        setLimits={changeLimits}
                        setOrder={changeOrder}
                        totalRows={rowCount}
                    />
                </Tab>
            </Tabs>
        </>
    )
}
