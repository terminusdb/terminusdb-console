import React, { useState, useEffect } from 'react';
import Select from "react-select";
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { isObject } from "../../utils/helperFunctions"
import { GET_BRANCH_LIST } from "../../labels/queryLabels"
import { hooks } from "../../hooks"
import { getQuery } from "../../utils/queryList"

const BranchSelector = (props) => {
    /*const [query, setQuery] = useState(false);
	const [result, setResult] = useState(false);
    const [dbClient] = useGlobalState(TERMINUS_CLIENT);
    const [curr] = useState(false);

    const [dataProvider] = hooks(query);*/
    const [values, setReactSelect] = useState({
      selectedOption: []
    });

    /*useEffect(() => {
		const q = getQuery(GET_BRANCH_LIST, {dbId: dbClient.db()});
		setQuery(q);
    }, [curr]);

    useEffect(() => {
        if(isObject(dataProvider)){
			let wr = dataProvider.results;
		}
    }, [dataProvider]);*/

    const currBranch = 'Master';
    const opts = [   // do whatever call to get branch list of db
        {value: currBranch, label: currBranch},
        {value: 'dev', label: 'dev'},
        {value: 'QA', label: 'QA'},
        {value: 'pre live', label: 'pre live'},
        {value: 'test', label: 'test'},
        {value: 'br01', label: 'br01'}
    ]


    return (
      <Select placeholder = { "Branch: " + currBranch }
              className = "brSeltr"
              value = {values.selectedOption}
              options = {opts}/>
   );
}

export default BranchSelector;
