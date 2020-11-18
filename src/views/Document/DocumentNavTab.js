import React, {useState, useEffect} from 'react'
import {BsBook, BsBookHalf} from "react-icons/bs"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "./TypeFilter"
import {TypeStats} from "./TypeStats"
import {Row, Col} from "reactstrap"
import {FileLoader} from "./FileLoader"

export const DocumentNavTab = ({isAdding, total, types, current, docType, changeDocType, limit, setDocCount, docCount, doCreate, csvs, setCsvs, insertCsvs}) => {

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

	const DocumentTypeMeta = ({doctype, meta, count, onCreate}) => {
	    if(!doctype || !meta) return null
	    return <span>
				{!meta.abstract && <span className="create-new-button">
					<button className="tdb__button__base tdb__button__base--bgreen create-new-button-spacing subheader-btns" onClick={onCreate}>
						Create New
					</button>
				</span>}
            </span>
	}

	return (
		<div className="nav__main__wrap">
			<div className="tdb__model__header">
    			<Col>
					<div className="tdb__model__hright">
						{!isAdding && <Row style={{width:"100%"}}>
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
								<DocumentTypeMeta count={docCount} types={types} meta={current} doctype={docType} onCreate={doCreate}/>
							</Col>
							<Col md={3}>
			                    <DocumentSubTypeFilter doctype={docType} meta={current} setType={changeDocType} />
			                </Col>
							<Col md={2}>
								<FileLoader csvs={csvs} setCsvs={setCsvs} insertCsvs={insertCsvs}/>
							</Col>
						</Row>}
					</div>
				</Col>
			</div>
		</div>
	)
}
