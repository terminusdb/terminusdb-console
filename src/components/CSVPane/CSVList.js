import React, {useState, useEffect} from "react"
import TerminusClient from '@terminusdb/terminusdb-client'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {CSVPreview} from "./CSVPreview"
import {CSVViewContents} from "./CSVViewContents"
import {DOCTYPE_CSV, DOCUMENT_VIEW_FRAGMENT} from "./constants.csv"
import {Row, Col} from "reactstrap"
import {ControlledTable} from '../../views/Tables/ControlledTable'

export const CSVList=()=>{
	const [preview, setPreview] = useState({show:false, fileName:false, data:[], selectedCSV: false})
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
        setPreview({show: true, fileName: name, data:[], selectedCSV: id, page:DOCUMENT_VIEW_FRAGMENT});
    }

	const tabConfig=TerminusClient.View.table();
	tabConfig.column_order("Document ID", "Name", "Type Name", "Description")
    tabConfig.pagesize(5)
    tabConfig.pager("remote")
    tabConfig.column("Document ID", "Name", "Description").minWidth(100).click(csvRowClick)

	return (<>
            <main className="console__page__container console__page__container--width">
                <ControlledTable
                    query={query}
                    freewidth={true}
                    view={tabConfig}
                    limit={tabConfig.pagesize()}/>
				{preview.show && <CSVViewContents preview={preview} setPreview={setPreview}
		            previewCss={"csv-preview-results csv-preview-results-border"}/>}
            </main>

    </>)
}
