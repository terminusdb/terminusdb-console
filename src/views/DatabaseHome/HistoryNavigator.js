import React, { useState, useEffect } from "react";
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { GET_COMMITS } from "../../labels/queryLabels"
import { getQuery } from "../../utils/queryList"
import { isObject } from "../../utils/helperFunctions"
import { hooks } from "../../hooks"
import { getCommitControl } from "../../utils/stateChange"
import { DateTimeSlider } from '../../components/Slider/DateTimeSlider'

export const HistoryNavigator = (props) => {
    const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    const [query, setQuery] = useState(false);
	const [result, setResult] = useState(false);
    const [min, setMin] = useState(false);
    const [selected, setSelected] = useState(false);
    const show = true;
    const [dataProvider] = hooks(query);

    useEffect(() => {
		const fq = getQuery(GET_COMMITS, {dbId: dbClient.db(),
                    isBranch: true,
					bid: dbClient.checkout()});
		setQuery(fq);
    }, [show]);

    useEffect(() => {
        if(isObject(dataProvider)){
			let wr = dataProvider.results;
            const bindings = wr.getBindings();
            setMin({CommitID: bindings[0].CommitID['@value'],
                Time: bindings[0].Time['@value']})
		}
    }, [dataProvider]);

    return (
        <>
           {min && <DateTimeSlider min = { min }
                setSelected = { setSelected }/>}
        </>
    )
}
