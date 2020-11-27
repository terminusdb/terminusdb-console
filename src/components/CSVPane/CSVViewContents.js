import React, {useState, useEffect} from 'react'
import {Row, Col} from "reactstrap"
import {WOQLClientObj} from '../../init/woql-client-instance'
import {ControlledTable} from '../../views/Tables/ControlledTable'
import TerminusClient from '@terminusdb/terminusdb-client'
import {isArray} from "../../utils/helperFunctions"
import {DOCUMENT_VIEW, CREATE_DB_VIEW, DOWNLOAD_ENTIRE_FILE, DOWNLOAD_SNIPPET, DELETE, DOCUMENT_VIEW_FRAGMENT} from "./constants.csv"
import {BiArrowBack, BiDownload} from "react-icons/bi"
import {MdFileDownload} from "react-icons/md"
import Loading from '../../components/Reports/Loading'
import {TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_COMPONENT} from '../../constants/identifiers'
import {jsonToCSV} from 'react-papaparse';
import {TerminusDBSpeaks} from '../../components/Reports/TerminusDBSpeaks'
import {RiDeleteBin5Line} from "react-icons/ri"
import {TERMINUS_TABLE} from "../../constants/identifiers"
import {DBContextObj} from '../../components/Query/DBContext'

export const CSVViewContents=({preview, setPreview, previewCss})=>{
	const {woqlClient} = WOQLClientObj()
	let propertyColumnNames=[]
	const [query, setQuery] = useState(false)
	const tabConfig=TerminusClient.View.table();
	const [tConf, setTConf]=useState({})
	const [cols, setCols]=useState([])
	//const [snippet, setSnippet]=useState([])

    const {updateBranches} = DBContextObj()


	const [loading, setLoading]=useState(false)
    const [report, setReport]=useState(false)

	useEffect(() => {
		let id=preview.selectedCSV
		let WOQL=TerminusClient.WOQL
		// get property names from graph
        const q=WOQL.and (
			WOQL.limit(1).triple('v:CSV ID', 'type', 'scm:CSV').eq('v:CSV ID', id).triple('v:CSV ID', 'scm:csv_row', 'v:CSV Row')
				.triple('v:CSV Row', 'type', 'v:Row Type'),
		  	WOQL.quad('v:Property', 'domain', 'v:Row Type', 'schema/main').quad('v:Property', 'label', 'v:Property Name' ,'schema/main')
		)
		let columnQuery = []
        woqlClient.query(q).then((results) => {
			let wr = new TerminusClient.WOQLResult(results, q)
			for(var key in wr.bindings){
				let property=wr.bindings[key]["Property"]
				let propertyName= "v:" + wr.bindings[key]["Property Name"]["@value"].replace('Column ','')
				propertyColumnNames.push(wr.bindings[key]["Property Name"]["@value"].replace('Column ',''))
				columnQuery.push(WOQL.triple('v:CSV Row', property, propertyName))
			}
			setCols(propertyColumnNames)
			let qp=WOQL.and(
				WOQL.triple('v:CSV ID', 'type', 'scm:CSV').eq('v:CSV ID', id),
				WOQL.and(...columnQuery)
			)
			tabConfig.pagesize(10)
			tabConfig.pager("remote")
			tabConfig.column_order(...propertyColumnNames)
			setTConf(tabConfig)
			setQuery(qp)
		})
	}, [preview.selectedCSV])

	function process_error(err, update_start, message){
        setReport({
            error: err,
            status: TERMINUS_ERROR,
            message: message,
            time: Date.now() - update_start,
        })
        console.log(err)
    }

	const downloadCSV=async()=>{
		let name=preview.fileName
        let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
		return await woqlClient.getCSV(name, true).then((results) =>{
			setReport({status: TERMINUS_SUCCESS, message: "Successfully downloaded file " + name})
		})
		.catch((err) => process_error(err, update_start, "Failed to download file " + name))
		.finally(() => setLoading(false))
	}

	const deleteCSV=async()=>{
        let name=preview.fileName
        let update_start = Date.now()
        setLoading(true)
        update_start = update_start || Date.now()
        let commitMsg="Deleting File " + name + "-" + update_start
        return await woqlClient.deleteCSV(name, commitMsg).then((results) =>{
            updateBranches()
			setReport({status: TERMINUS_SUCCESS, message: "Successfully deleted file " + name})
		})
		.catch((err) => process_error(err, update_start, "Failed to retrieve file " + name))
		.finally(() => setLoading(false))
    }

	const CSVViewTitle=({fileName})=>{
		return <h3 className="db_info d-nav-text">
            <span> Showing contents of file  <strong>{fileName} </strong> </span>
        </h3>
	}

	const CSVDownloadIcons=({preview})=>{
		return <span style={{fontSize: "2em"}}>
	        <span onClick={downloadCSV} className="d-nav-icons" title={DOWNLOAD_ENTIRE_FILE}>
	            <MdFileDownload className="db_info_icon_spacing"/>
	        </span>
	    </span>
	}

	/*
	{<span onClick={downloadSnippet} className="d-nav-icons" title={DOWNLOAD_SNIPPET}>
		<BiDownload className='db_info_icon_spacing'/>
	</span>}
	*/

	const CSVDelete=({preview})=>{
		return <span style={{fontSize: "2em"}}>
			<span onClick={deleteCSV} className="d-nav-icons" title={DELETE}>
				<RiDeleteBin5Line color="#721c24" className='db_info_icon_spacing'/>
			</span>
	    </span>
	}

	const CSVGoBackIcon=({preview})=>{
		return <span style={{fontSize: "2em"}}>
	        <span onClick={()=> setPreview({show: false, fileName:false, data:[], selectedCSV: false})}
				className="d-nav-icons" title={"Close contents and go back"}>
	            <BiArrowBack className="db_info_icon_spacing"/>
	        </span>
		</span>
	}

	const PreviewToolBarForSingleDocuments = ({preview, setPreview}) => {
		return (
		<div className="nav__main__wrap">
			<div className="tdb__model__header">
				<Col>
					<div className="tdb__model__hright">
						<Row style={{width:"100%"}}>
							<Col md={2}>
							</Col>
							<Col md={7}>
                                <CSVViewTitle fileName={preview.fileName}/>
                            </Col>
							<Col md={2}>
                                <CSVDownloadIcons preview={preview}/>
								<CSVDelete preview={preview}/>
                            </Col>
							<Col md={1}>
                                <CSVGoBackIcon preview={preview}/>
                            </Col>
						</Row>
					</div>
				</Col>
			</div>
		</div>)
	}


	const Contents=({preview, query, tConf})=>{
		return <Row className={previewCss}>
			<ControlledTable
				query={query}
				freewidth={true}
				view={tConf}
				loadingType={TERMINUS_TABLE}
				limit={tConf.pagesize()}/>
		</Row>
	}

	return <>
		{preview.show && <>
			{(preview.selectedCSV) && query &&  tConf && <>
				<PreviewToolBarForSingleDocuments preview={preview} setPreview={setPreview}/>
				<main className="console__page__container console__page__container--width section-container">
					<Row className="generic-message-holder">
						{report && <TerminusDBSpeaks report={report}/>}
					</Row>
					{loading &&  <Loading type={TERMINUS_COMPONENT} />}
					<Contents preview={preview} query={query} tConf={tConf}/>
				</main>
			</>}
		</>}
	</>
}
