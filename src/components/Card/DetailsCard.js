import React from "react";
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DetailsCard = (props) => {

    return (
      <div className="dd-c">
          <div className="card card-stats">
            <div className="content">
              <Row>
                <Col xs={4}>
                  <div className="dd-ico">
                    <FontAwesomeIcon icon={props.icon} className="mr-3" />
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="dd-t">
                    <legend className="dd-mute">{props.title}</legend>
                    <p className="dd-p">{props.main}</p>
                    <p className="dd-st">{props.subTitle}</p>
                  </div>
                </Col>
              </Row>
              <div className="dd-footer">
                <hr />
                <div className="dd-f-txt">
                   {props.info}
                </div>
              </div>
            </div>
          </div>
      </div>
    );
}
