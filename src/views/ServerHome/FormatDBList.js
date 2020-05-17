import React from "react";


export const getDBListColumns = (list) => {
    const columns = [];
    for (let it of Object.keys(list)){
        for (var key in list[it]){
           // if(["@id", "rdfs:label"].indexOf(key) != -1){
                columns.push({
                    name: formatColumnNames(key),
                    selector: key,
                    sortable: true,
                    minWidth: '200px'
                })
           // }
        }
        // hardcoding Source col as of now coz not sure from where to get this info
        columns.push({name: 'Source', selector: 'Source', sortable: true, minWidth: '200px'})
        columns.push({name: 'View', selector: 'View', sortable: true, minWidth: '200px'})
        return columns;
    }

}


export const getDBListData = (list) => {
    const data = [];
    for (let it of Object.keys(list)){
        const row =  parseObject(list[it])
        data.push(row);
    }
    return data;
}
