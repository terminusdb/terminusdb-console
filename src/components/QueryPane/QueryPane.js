import React, {useState, useEffect, useMemo} from 'react'
import {QueryEditor} from './QueryEditor'
import {QueryLibrary} from './QueryLibrary'
import {ReportWrapper} from './ReportWrapper'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {Tabs, Tab} from 'react-bootstrap-tabs'
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
    const [selectedTab, changeTab] = useState(0)
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
            changeTab(1)
            return [{}]
        } else return [{disabled:true}]
    }, [result])

    const onSelect = (k) => {
        changeTab(k)
    }

    const updateWOQL = (q) => {
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
            updateQuery(q)
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
            {/* <nav className="nav__main">
                <ul className="nav__main__center">
                    <li className="nav__main__item">
                        <button className="nav__main__link">Query</button>
                    </li>
                    <li className="nav__main__item">
                        <button className="nav__main__link">Result</button>
                    </li>
                </ul>
            </nav> */}
            <ReportWrapper {...errorObj}>{errorChild}</ReportWrapper>

            <Tabs selected={selectedTab} onSelect={onSelect} id="query_tabs">
                <Tab label={QUERY_PANEL_TITLE}>
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
                <Tab label="Result Viewer" {...disabled}>
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
