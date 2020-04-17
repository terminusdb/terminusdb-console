import React, { useState } from 'react';
import { RENDER_TYPE_TABLE } from "../../labels/renderTypeLabels";
import { Card, CardText, CardBody }  from "reactstrap";
import RenderTable from "../../components/RenderTable";
import { SCHEMA_LIST_OF_CLASSES_QUERY } from '../../labels/queryLabels';
import { QueryHook } from "../../hooks/QueryHook";
import * as queryList from '../../utils/queryList';
import { hooks } from "../../hooks"
//import { QueryPane } from "../../components/QueryPane"

export const Classes = (props) => {

    const getDataProvider0 = () => {
            const [dataResponse] = QueryHook(SCHEMA_LIST_OF_CLASSES_QUERY,
                                             RENDER_TYPE_TABLE);
            return dataResponse;
    }

    const getDataProvider = () => {
        const [dataResponse] = hooks(SCHEMA_LIST_OF_CLASSES_QUERY);
        return dataResponse;
    }

    return (
        <div className = "tab-co">
            <Card>
                <CardBody>
                    <RenderTable dataProvider = {getDataProvider0()}/>
                 </CardBody>
            </Card>
        </div>
    )
}
