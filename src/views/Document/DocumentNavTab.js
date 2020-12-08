import React, {useState, useEffect} from 'react'
import {BsBook, BsBookHalf, BsPlus} from "react-icons/bs"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "./TypeFilter"
import {TypeStats} from "./TypeStats"
import {Row, Col} from "reactstrap"
import {FileLoader} from "./FileLoader"
import {DOCTYPE_CSV} from '../../components/CSVPane/constants.csv'
import {CREATE_NEW_DOCUMENT, GO_BACK} from './constants.document'
import {BiArrowBack} from "react-icons/bi"

export const DocumentNavTab = ({isAdding, total, types, current, docType, changeDocType, limit, setDocCount, docCount, doCreate, csvs, setCsvs, insertCsvs, onCsvCancel}) => {

    const [showAdding, setShowAdding] = useState(false)

	const TotalStats = ({total, doctype, docCount}) => {
        if(typeof total != "number") return null
        if(doctype && typeof docCount == "number" && total > 0){
            return <span className="db-card-credit subheader-spacing" title={docCount + " " + doctype + " documents of " + total + " total"}>
                <BsBookHalf className="db_info_icon_spacing"/>
                <span className="db_info">
                    <span className="tdb__dblist__info--blue">
                        {docCount} / {total}
                    </span>
                </span>
            </span>
        }
        return <span className="db-card-credit subheader-spacing" title={total + " documents"}>
            <BsBook className="db_info_icon_spacing"/>
                <span className="db_info">
                    <span className="tdb__dblist__info--blue">
                        {total}
                    </span>
                </span>
            </span>
	}

    const myCreate = () => {
       // if(current) {
            doCreate()
        //}
        //else {
        //    setShowAdding(true)
        //}
    }

    const DocumentTypeMeta = ({doctype, meta, types, count, onCreate}) => {
        if(!types) return null
        if(types.length == 0 || (types.length == 1 && types[0]['Class ID'] == DOCTYPE_CSV) 
        || (docType && doctype==DOCTYPE_CSV)){
            return null
        }
	    return <span>
            <span style={{fontSize: "2em"}}>
                <span onClick={onCreate} className="d-nav-icons" title={CREATE_NEW_DOCUMENT}>
                    <BsPlus className="db_info_icon_spacing"/>
                </span>
            </span>
        </span>
    }
    
	return (
		<div className="nav__main__wrap">
			<div className="tdb__model__header">
    			<Col>
					<div className="tdb__model__hright">
						{!isAdding && <Row style={{width:"100%"}}>
							{(csvs.length==0) && <>
								<Col md={2}>
	                                <TotalStats total={total} doctype={docType} docCount={docCount}/>
								</Col>
								<Col md={3}>
									{<DocumentTypeFilter types={types} meta={current} doctype={docType} setType={changeDocType} />}
								</Col>
								<Col md={2}>
									{docType &&
				                        <TypeStats
				                            total={total}
				                            meta={current}
				                            doctype={docType}
				                            limit={limit}
				                            setTotal={setDocCount}/>}
									<DocumentTypeMeta count={docCount} types={types} meta={current} doctype={docType} onCreate={myCreate}/>
								</Col>
								<Col md={3}>
				                    <DocumentSubTypeFilter doctype={docType} meta={current} setType={changeDocType} />
				                </Col>
								<Col md={2}>
									<FileLoader csvs={csvs} setCsvs={setCsvs} insertCsvs={insertCsvs}/>
								</Col>
							</>}
							{(csvs.length>0) && <Row style={{width: "100%"}}>
								<Col md={10}></Col>
								<Col md={2}>
									<FileLoader csvs={csvs} setCsvs={setCsvs} insertCsvs={insertCsvs}/>
									<span style={{fontSize: "2em", float: "right", marginRight:"5px"}}>
										<span onClick={onCsvCancel} className="d-nav-icons" title={GO_BACK}>
											<BiArrowBack className="db_info_icon_spacing"/>
										</span>
									</span>
								</Col>
							</Row>}
						</Row>}
					</div>
				</Col>
			</div>
		</div>
	)
}

