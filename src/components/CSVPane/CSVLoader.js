import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import {ResultViewer} from "../../components/QueryPane/ResultViewer"
import Loading from '../../components/Reports/Loading'
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {CSVInput} from "./CSVInput"
import {TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {SelectedCSVList} from "./SelectedCSVList"
import {CSVPreview} from "./CSVPreview"

export const CSVLoader = ({csvs, title, setCsvs, insertCsvs, addButton, page, availableCsvs}) => {
	const [preview, setPreview] = useState({show:false, fileName:false, data:[]})

    const [loading, setLoading] = useState(false)

	return (
            <div className="context-style sub-headings csv-info csv-container">
                <Row key="rm" className="db_info_branch_text csv_title">
                    <Col md={10} className="csv-title-align">{title}</Col>
                    <Col md={2}>
                        <CSVInput text={addButton} onChange={insertCsvs} css={"add-csv"} inputCss="add-files" multiple={true}/>
                    </Col>
                </Row>
                <Row key="rd" className="database-context-row detail-credits">
                    {loading &&  <Loading type={TERMINUS_COMPONENT} />}
                    {/*<Row className="generic-message-holder">
                        {report && <TerminusDBSpeaks report={report}/>}
                    </Row>*/}
                    <SelectedCSVList setLoading={setLoading} csvs={csvs} page={page} preview={preview}
						setPreview={setPreview} setCsvs={setCsvs} availableCsvs={availableCsvs}/>
                    <CSVPreview preview={preview} setPreview={setPreview}/>
                </Row>
            </div>
	)
}
