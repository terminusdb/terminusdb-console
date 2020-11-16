import React, {useState, useEffect} from 'react'
import {BsBook, BsBookHalf} from "react-icons/bs"
import {AiOutlinePlusSquare} from "react-icons/ai"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "../Document/TypeFilter"
import {TypeStats} from "../Document/TypeStats"
import {Row, Col} from "reactstrap"
import {FileLoader} from "../Document/FileLoader"

export const DocumentNavTab = ({isAdding, total, types, current, docType, changeDocType, limit, setDocCount, docCount, doCreate, csvs, setCsvs, insertCsvs}) => {

	const TotalStats = ({total}) => {
	    if(typeof total != "number") return null
	    return <span>{total} Document{(total === 1 ? "" : "s")} </span>
	}

	const DocumentTypeMeta = ({doctype, meta, count, onCreate}) => {
	    if(!doctype || !meta) return null
	    return <span>
				<span className="db-card-credit subheader-spacing">
					<BsBookHalf className="db_info_icon_spacing"/>
					<span className="db_info">
						<span className="tdb__dblist__info--blue" title={doctype + ": " + meta.description}>
							{count} {meta.label} Document{(count === 1 ? "" : "s")}
						</span>
					</span>
				</span>
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
				<Col md={2}></Col>
				<Col md={8}>
					<div class="tdb__model__hright">
						{!isAdding && <Row style={{width:"100%"}}>
							<Col md={2}>
								<span className="db-card-credit subheader-spacing">
									<BsBook className="db_info_icon_spacing"/>
									<span className="db_info">
										<span className="tdb__dblist__info--blue"><TotalStats total={total} /></span>
									</span>
								</span>
							</Col>
							<Col md={3}>
								{<DocumentTypeFilter types={types} meta={current} doctype={docType} setType={changeDocType} />}
							</Col>
							<Col md={4}>
								{docType &&
			                        <TypeStats
			                            total={total}
			                            meta={current}
			                            doctype={docType}
			                            limit={limit}
			                            setTotal={setDocCount}/>}
								<DocumentTypeMeta count={docCount} types={types} meta={current} doctype={docType} onCreate={doCreate}/>
							</Col>
							<Col md={2}>
			                    <DocumentSubTypeFilter doctype={docType} meta={current} setType={changeDocType} />
			                </Col>
							<Col md={1}>
								<FileLoader csvs={csvs} setCsvs={setCsvs} insertCsvs={insertCsvs}/>
							</Col>
						</Row>}
					</div>
				</Col>
				<Col md={2}></Col>
			</div>
		</div>
	)
}
