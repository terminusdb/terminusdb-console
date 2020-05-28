import React from "react"
import RenderTable from "../../components/Table/RenderTable"

export const DBList = ({list}) => {

    function getDBListColumns(list){
        const columns = [];
        if(list[0]){
            Object.keys(list[0]).forEach(key => columns.push({ name: key, selector: key, sortable: true}))
        }
        return columns;
    }       

    const dataProvider = {columnData:list, columnConf:getDBListColumns(list)}
    return (<RenderTable fromPage="home" dataProvider={dataProvider} />)
} 
