import React, { useState } from "react";
import { PageView } from '../Templates/PageView'
import {ControlledTable} from '../Tables/ControlledTable'
import TerminusClient from '@terminusdb/terminusdb-client'
import {WOQLClientObj} from '../../init/woql-client-instance'
import {TERMINUS_TABLE, TERMINUS_ERROR} from "../../constants/identifiers"
import {printts, DATETIME_COMPLETE} from '../../constants/dates'

const RepoStatus=()=>{
    const {woqlClient} = WOQLClientObj()
    let WOQL=TerminusClient.WOQL
    let query = WOQL.and (
	  WOQL.triple("v:Repo", "type", "scm:GitHubRepository"),
	  WOQL.opt().triple("v:Repo", "label", "v:Name"),
	  WOQL.opt().triple("v:Repo", "gitHub_stargazers_count", "v:Stars Count"),
	  WOQL.opt().triple("v:Repo", "gitHub_open_issues_count", "v:Issues Count"),
	  WOQL.opt().triple("v:Repo", "gitHub_forks_count", "v:Forks Count"),
	  WOQL.opt().count("v:Commits Count", WOQL.triple("v:Repo", "gitHub_repository_commit", "v:Commits"))
	)

    let view=TerminusClient.View.table();
    view.column_order("Repo", "Name", "Stars Count", "Issues Count", "Forks Count","Commits Count")
    view.pagesize(10)
    view.pager("remote")

    return <>
        <div className="ros-summary-title">Repo Metrics</div>
        <ControlledTable
            query={query}
            freewidth={true}
            view={view}
            loadingType={TERMINUS_TABLE}
            limit={view.pagesize()}/>
    </>
}

const RepoStars=()=>{
    const {woqlClient} = WOQLClientObj()
    let WOQL=TerminusClient.WOQL
    let query = WOQL.and (
        WOQL.triple("v:Repo", "type", "scm:GitHubRepository"),
        WOQL.opt().triple("v:Repo", "label", "v:Repo Name"),
        WOQL.opt().triple("v:Repo", "scm:gitHub_repository_star", "v:Star"),
        WOQL.opt().triple("v:Star", "scm:starred_at", "v:Starred At"),
        WOQL.opt().triple("v:User", "scm:gitHub_user_star", "v:Star"),
        WOQL.opt().triple("v:User", "label", "v:User Name"),
    )


    let view=TerminusClient.View.table();
    view.column_order("Repo", "Repo Name", "Star", "Starred At", "User","User Name")
    view.pagesize(10)
    view.pager("remote")

    return <>
        <div className="ros-summary-title">Repo Starred by Users</div>
        <ControlledTable
            query={query}
            freewidth={true}
            view={view}
            loadingType={TERMINUS_TABLE}
            limit={view.pagesize()}/>
        </>
}

const MetricsPage = () => {

    return (
        <PageView dbPage={true}>
            <RepoStatus/>
            <RepoStars/>
        </PageView>
    )
}

export default MetricsPage;
