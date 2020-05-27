import React, { useState } from "react";
import { Row, Col  } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const SUB_TITLE_LIMIT = 24, MAIN_LIMIT = 10, TITLE_LIMIT = 12, INFO_LIMIT = 100;
import { trimContent } from "../../utils/helperFunctions"

export const DetailsCard = (props) => {

    const icon = props.icon || false

    return (
    <div className="dd-c">
          <div className="card card-stats">
                <div className="content">
                    <Row>
                        {icon && <>
                            <Col xs={4}>
                                <div className="dd-ico">
                                    <FontAwesomeIcon icon={props.icon} size="2x" className="terminus-title-icon" />
                                </div>
                            </Col>
                            <Col xs={8}>
                                <div className="dd-t">
                                    <legend className="dd-mute">{trimContent(props.title, TITLE_LIMIT)}</legend>
                                    <p className="dd-p">{trimContent(props.main, MAIN_LIMIT)}</p>
                                    <p className="dd-st">{trimContent(props.subTitle, SUB_TITLE_LIMIT)}</p>
                                </div>
                            </Col>
                        </>}
                        {!icon &&
                            <Col xs={12}>
                                <div className="dd-t">
                                    <legend className="dd-mute">{props.title}</legend>
                                    <p className="dd-p">{props.main}</p>
                                    <p className="dd-st">{props.subTitle}</p>
                                </div>
                            </Col>
                        }
                    </Row>
                    <div className="dd-footer">
                        <hr />
                        <div className="dd-f-txt">
                            {trimContent(props.info, INFO_LIMIT)}
                        </div>
                    </div>
                </div>
          </div>
    </div> )
}
