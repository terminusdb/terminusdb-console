import React, {useState} from 'react'

export const CSVInput = ({css, inputCss, onChange, text, multiple}) =>{

	return (
		<>
			<span className={css}>
				<input type="file"
					name="csvInp"
					id="csvInp"
					className={"inputfile "+inputCss}
					multiple={multiple}
					onChange={onChange}
					key={text}
					accept=".csv"/>
				<label for="csvInp">{text}</label>
			</span>
		</>
	)
}
