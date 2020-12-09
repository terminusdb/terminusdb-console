import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import Loading from '../../components/Reports/Loading'
import {CSVInput} from "./CSVInput"
import {TERMINUS_COMPONENT} from '../../constants/identifiers'
import {SelectedCSVList} from "./SelectedCSVList"
import {CSVPreview} from "./CSVPreview"
import {CREATE_DB_VIEW} from "./constants.csv"
import {TOOLBAR_CSS} from "../../views/Document/constants.document"
import {AiOutlineCloseCircle} from "react-icons/ai"

export const CSVLoader = ({csvs, title, setCsvs, insertCsvs, addButton, page, availableCsvs, setIsAdding, onCsvCancel}) => {
	const [preview, setPreview] = useState({show:false, fileName:false, data:[], selectedCSV:false})
	let css="csv-preview-results"
    const [loading, setLoading] = useState(false)

	return (<>
		<main className="console__page__container console__page__container--width section-container">
            <div className="sub-headings csv-info csv-container">
                <Row key="rd" className="database-context-row detail-credits chosen-csv-container">
                    {loading &&  <Loading type={TERMINUS_COMPONENT} />}
					{(page==CREATE_DB_VIEW) && <>
						<Row  className='csv-preview-header'>
					        <Col md={9}>
					            <span style={{fontSize: "2em"}}>
					                <span className="preview-bar-title">
					                    {title}
					                </span>
					            </span>
					        </Col>
							<Col md={2}>
		                        <CSVInput text={addButton} onChange={insertCsvs} css={"add-csv"} inputCss="add-files" multiple={true}/>
		                    </Col>
					        <Col md={1}>
					            <span style={{fontSize: "2em"}}>
					                <span onClick={onCsvCancel} className="d-nav-icons" title={"Close"}>
					                    <AiOutlineCloseCircle color="#721c24" className="db_info_icon_spacing"/>
					                </span>
					            </span>
					        </Col>
					    </Row>
					</>}
                    <SelectedCSVList setLoading={setLoading} csvs={csvs} page={page} preview={preview}
						setPreview={setPreview} setCsvs={setCsvs} availableCsvs={availableCsvs}/>
					<CSVPreview preview={preview} setPreview={setPreview} previewCss={css}/>
                </Row>
            </div>
		</main>
	</>)
}
