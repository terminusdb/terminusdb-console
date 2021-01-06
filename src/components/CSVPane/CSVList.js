import React, {useState, useEffect} from "react"
import TerminusClient from '@terminusdb/terminusdb-client'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {CSVViewContents} from "./CSVViewContents"
import {DOCTYPE_CSV, DOCUMENT_VIEW_FRAGMENT} from "./constants.csv"
import {Row, Col} from "reactstrap"
import {ControlledTable} from '../../views/Tables/ControlledTable'
import {BsCardList} from "react-icons/bs"

export const CSVList=()=>{
	const [viewContent, setViewContent] = useState({show:false, fileName:false, data:[], selectedCSV: false})
	let WOQL = TerminusClient.WOQL
	const csvQuery = () => {
        let q = WOQL.and(WOQL.lib().document_metadata())
        q.sub(DOCTYPE_CSV, "v:Type ID")
        return q
    }

	const [query, setQuery]=useState(csvQuery)

	let csvRowClick = function csvRowClick(cell){
		let row = cell.row
		let id=row.original["Document ID"], name=row.original.Name["@value"]
        setViewContent({show: true, fileName: name, data:[], selectedCSV: id, page:DOCUMENT_VIEW_FRAGMENT});
    }

	const tabConfig=TerminusClient.View.table();
	tabConfig.column_order("Document ID", "Name", "Type Name", "Description")
    tabConfig.pagesize(10)
    tabConfig.pager("remote")

	return (<>
            <main className="console__page__container console__page__container--width">
				<span className="db-card-credit csv_subheader_section">
					<BsCardList color={"#787878"} className="csv_info_icon_spacing"/>
					<span className="db_info existing_csv_subheader">
						CSV Documents
					</span>
				</span>
                <ControlledTable
                    query={query}
                    freewidth={true}
                    view={tabConfig}
                    limit={tabConfig.pagesize()}/>
				{viewContent.show && <CSVViewContents viewContent={viewContent} setViewContent={setViewContent}
		            previewCss={"csv-preview-results csv-preview-results-border"}/>}
            </main>

    </>)
}
