import React, { useState, useEffect } from "react";

const TestResult = (props) => {

	const bindings= props.bindings || []
	console.log(bindings);

	return(
		<div>		
			{JSON.stringify(bindings, null, 4)}
		</div>
	)
}

export default TestResult;