import React, { useState } from 'react';
import { RENDER_TYPE_TABLE } from "../../labels/renderTypeLabels";
import RenderTable from "../../components/RenderTable";
import { SCHEMA_LIST_OF_CLASSES_QUERY } from '../../labels/queryLabels';
import { QueryHook } from "../../hooks/QueryHook";

export const Classes = (props) => {

    const getDataProvider = () => {
            const [dataResponse] = QueryHook(SCHEMA_LIST_OF_CLASSES_QUERY,
                                             RENDER_TYPE_TABLE);
            return dataResponse;
    }

    return (
        <div className = "tab-co">
             <RenderTable dataProvider = {getDataProvider()}/>
        </div>
    )
}
