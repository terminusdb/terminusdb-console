import React from "react";
import { getNameFromUrl, getNameFromVariable, formatColumnNames,
    stripDocFromUrl } from '../../utils/extractStrings'

function parseObject(item){
    const row = {};
    for (let itemId of Object.keys(item)){
          if(typeof item[itemId] === 'object'){
              row[itemId] = item[itemId]['@value'];
              if(itemId === "v:Date"){
                row['timestamp'] = row[itemId];
              }
          }
          else {
              if(item[itemId] == "unknown") row[itemId] = "";
              else row[itemId] = stripDocFromUrl(item[itemId])
              //else row[itemId] = getNameFromUrl(item[itemId])
          }
    }
    return row;
}

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
        //columns.push({name: 'Source', selector: 'Source', sortable: true, minWidth: '200px'})
        //columns.push({name: 'View', selector: 'View', sortable: true, minWidth: '200px'})
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
