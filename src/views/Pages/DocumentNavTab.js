import React, {useState, useEffect} from 'react'
import {BsBook} from "react-icons/bs"
import {DocumentTypeFilter, DocumentSubTypeFilter} from "../Document/TypeFilter"
import {TypeStats} from "../Document/TypeStats"
import {Row, Col} from "reactstrap"

export const DocumentNavTab = ({isAdding, total, types, current, docType, changeDocType, limit, setDocCount, docCount, doCreate}) => {

	const TotalStats = ({total}) => {
	    if(typeof total != "number") return null
	    return <span>{total} Document{(total === 1 ? "" : "s")} </span>
	}

	const DocumentTypeMeta = ({doctype, meta, count, onCreate}) => {
	    if(!doctype || !meta) return null
	    return <span>
	            <span title={doctype + ": " + meta.description}>{count} {meta.label} Document{(count === 1 ? "" : "s")} </span>
	            {!meta.abstract &&
	                <button onClick={onCreate}> Create New </button>
	            }
	        </span>
	}

	return (
		<div className="nav__main__wrap">
			<div className="tdb__model__header">
				<div class="tdb__model__hright"></div>
				<div class="tdb__model__hright">
					{!isAdding && <Row style={{width:"100%"}}>
						<Col md={2}>
							<span className="db-card-credit csv-act">
								<BsBook color="#0055bb" className='db_info_icon_spacing csv_icon_spacing'/>
								<TotalStats total={total} />
							</span>
						</Col>
						<Col md={4}>
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
						<Col md={4}>
		                    <DocumentSubTypeFilter doctype={docType} meta={current} setType={changeDocType} />
		                </Col>
					</Row>}
				</div>
				<div class="tdb__model__hright"></div>
			</div>
		</div>
	)
}
