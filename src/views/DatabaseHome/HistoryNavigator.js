import React, { useState, useEffect } from "react";
import { GET_COMMITS } from "../../labels/queryLabels"
import { getQuery } from "../../utils/queryList"
import { isObject } from "../../utils/helperFunctions"
import { DateTimeSlider } from '../../components/Slider/DateTimeSlider'
import { WOQLClientObj } from "../../init/woql-client-instance";
import { Report } from "../../QueryPane/Report"

export const HistoryNavigator = (props) => {
    const [query, setQuery] = useState(false);
	const [result, setResult] = useState(false);
    const [min, setMin] = useState(false);
    const [selected, setSelected] = useState(false);
    const show = true;
    const [rep, setReport] = useState({})
    const {woqlClient} = WOQLClientObj();

    useEffect(() => {
		const fq = getQuery(GET_COMMITS, {dbId: dbClient.db(),
                    isBranch: true,
					bid: dbClient.checkout()});
        fq.(woqlClient, commit_msg).then((results) => {
            const bindings = wr.getBindings();
            setMin({CommitID: bindings[0].CommitID['@value'],
                    Time: bindings[0].Time['@value']})
        })
        .catch((err)=>{
             setReport({error: err, status: tag.ERROR});
         })
    }, [show]);

    return (
        <>
           {isObject(rep) && <Report report = { rep }/>}
           {min && <DateTimeSlider min = { min }
                setSelected = { setSelected }/>}
        </>
    )
}
