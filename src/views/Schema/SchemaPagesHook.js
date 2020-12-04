import React, {useState, useEffect} from 'react'
import {DBContextObj} from '../../components/Query/DBContext'

export const SchemaPagesHook = (props) => {
    const {graphs, setHead, branch, report, prefixes} = DBContextObj()

    const [graphFilter, setGraphFilter] = useState()

    useEffect(() => {
        if (graphs) {
            if (graphFilter) {
                let fi = updateFilter()
                setGraphFilter(fi)
            } else {
                setGraphFilter()
            }
        }
    }, [graphs])

    //updates filter when / if graphs changes
    function updateFilter() {
        let putative = false
        for (var key in graphs) {
            if (graphs[key].id == graphFilter.id && graphs[key].type == graphFilter.type)
                return graphFilter
            if (graphs[key].type == graphFilter.type && graphFilter.id == '*') return graphFilter
            if (graphs[key].type == graphFilter.type) putative = graphs[key].id
        }
        if (putative) return {id: putative, type: graphFilter.type}
        //else return getDefaultFilter()
    }

    //sets default graph filter depending on graphs configuration
    function getDefaultSchemaFilter() {
        let t = false
        let id = false
        for (var key in graphs) {
            if (graphs[key].type == 'schema') {
                if (t == 'schema') {
                    return {type: 'schema', id: '*'}
                } else {
                    t = 'schema'
                    id = graphs[key].id
                }
            } else if (graphs[key].type == 'inference') {
                if (t == 'inference') {
                    id = '*'
                } else if (t != 'schema') {
                    t = 'inference'
                    id = graphs[key].id
                }
            }
        }
        if (t && id) return {type: t, id: id}
        return undefined
    }

    function getDefaultInstanceFilter() {
        let cand = false;
        for (var key in graphs) {
            if (graphs[key].type == 'schema'){
                if(!cand || cand.type != 'schema' || graphs[key].id == "main"){
                    cand = graphs[key]
                }
            }            
            if (graphs[key].type == 'inference'){
                if(!cand || cand.type == 'instance'){
                    cand = graphs[key]
                }
            }
            if (graphs[key].type == 'instance'){
                if(!cand){
                    cand = graphs[key]
                }
            }
        }
        if(cand) return cand
        return {type: "instance", id: "main"}
    }

    /**
     * Prompt refresh by setting time to slightly in future
     */
    function schemaUpdated() {
        setHead(branch)
    }

    /*function prefixesUpdated() {
        console.log('prefixes updated')
    }*/

    function graphFilterChanged(newFilter) {
        setGraphFilter(newFilter)
    }

    return [schemaUpdated, getDefaultInstanceFilter, getDefaultSchemaFilter, graphFilter, graphs]
}
