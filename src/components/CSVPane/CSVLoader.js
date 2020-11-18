import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import {ResultViewer} from "../../components/QueryPane/ResultViewer"
import Loading from '../../components/Reports/Loading'
import {CSVInput} from "./CSVInput"
import {TERMINUS_COMPONENT} from '../../constants/identifiers'
import {SelectedCSVList} from "./SelectedCSVList"
import {CSVPreview} from "./CSVPreview"
import {CREATE_DB_VIEW} from "./constants.csv"
import {TOOLBAR_CSS} from "../../views/Document/constants.document"

export const CSVLoader = ({csvs, title, setCsvs, insertCsvs, addButton, page, availableCsvs, setIsAdding, onCsvCancel}) => {
	const [preview, setPreview] = useState({show:false, fileName:false, data:[]})
	let css="csv-preview-results"
    const [loading, setLoading] = useState(false)

	return (<>
		<main className="console__page__container console__page__container--width">
            <div className="sub-headings csv-info csv-container">
                {(page==CREATE_DB_VIEW) && <Row key="rm" className="db_info_branch_text csv_title">
                    <Col md={10} className="csv-title-align">{title}</Col>
                    <Col md={2}>
                        <CSVInput text={addButton} onChange={insertCsvs} css={"add-csv"} inputCss="add-files" multiple={true}/>
                    </Col>
                </Row>}
                <Row key="rd" className="database-context-row detail-credits chosen-csv-container">
                    {loading &&  <Loading type={TERMINUS_COMPONENT} />}
					{(page==CREATE_DB_VIEW) && <>
						<Col md={10}></Col>
						<Col md={2}>
							<button className={TOOLBAR_CSS.editOWLButton+" close-button"} onClick={onCsvCancel}>Close</button>
						</Col>
					</>}
                    <SelectedCSVList setLoading={setLoading} csvs={csvs} page={page} preview={preview}
						setPreview={setPreview} setCsvs={setCsvs} availableCsvs={availableCsvs}/>
					<CSVPreview preview={preview} setPreview={setPreview} previewCss={css}/>
                </Row>
            </div>
		</main>
	</>)
}
