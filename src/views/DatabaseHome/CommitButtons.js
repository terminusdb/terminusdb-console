import React, { useState, useEffect } from "react";
import { TERMINUS_CLIENT } from "../../labels/globalStateLabels"
import { useGlobalState } from "../../init/initializeGlobalState";
import { GET_FIRST_COMMIT_DETAILS } from "../../labels/queryLabels"
import { getQuery } from "../../utils/queryList"
import { isObject } from "../../utils/helperFunctions"
import { hooks } from "../../hooks"
import { getCommitControl } from "../../utils/stateChange"
import { GET_COMMITS } from "../../labels/queryLabels"
import { nextCommit, previousCommit } from "../../variables/formLabels"
import * as tag from "../../labels/tags"

export const CommitButtons = (props) => {
    //const [updatedCommit] = props.setUpdatedCommitButton;
    const [dbClient] = useGlobalState(TERMINUS_CLIENT);

    const [query, setQuery] = useState(false);
	const [result, setResult] = useState(false);
	const [currentCommitMsg, setCurrentCommitMsg] = useState(false);
	const [parent, setParent] = useState(false);
	const [child, setChild] = useState(false);
    const rId = props.head || false;

    const [dataProvider] = hooks(query);

	//const cc = dbClient.connectionConfig;
	//console.log('cc', cc)

	//const rId = dbClient.ref();
	//const rId = 'jqpg9g4eewiqq1kc0innjbwvmy8ydey'

	const is_branch = false;
	const [brId, setBrId] = useState(rId);
	const [isBranch, setIsBranch] = useState(is_branch);

    //updatedCommit(props.head)

    useEffect(() => {
		const q = getQuery(GET_COMMITS, {dbId: dbClient.db(),
					isBranch: isBranch,
					bid: brId});
		setQuery(q);
    }, [brId, isBranch]);

	useEffect(() => {
		if(isObject(dataProvider)){
			let wr = dataProvider.results;
			getCommitControl(wr, brId, setParent, setChild, setCurrentCommitMsg);
			let bhead = wr.first()['BranchName']["@value"]
			if(bhead){
				dbClient.ref(false)
				dbClient.checkout(bhead)
			}
			else {
				dbClient.ref(brId)
			}
		}
    }, [dataProvider]);

    const handlePreviousCommit = () => {
		setBrId(parent)
        //updatedCommit(parent)
		setIsBranch(false)
	}

	const handleNextCommit = () => {
		setBrId(child)
        //updatedCommit(child)
		setIsBranch(false)
	}

    return (
        <span className = "d-fl mb-8 cc">
            <button onClick={handleNextCommit}>
                { nextCommit.text }
            </button>
            <button onClick={handlePreviousCommit}>
                { previousCommit.text }
            </button>
            {currentCommitMsg && <label className="curr-c">
                { currentCommitMsg }
            </label>}
        </span>
    )
}
