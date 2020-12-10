import React, {useState} from 'react'

export const CSVInput = ({css, style, inputCss, onChange, text, multiple, labelCss}) =>{

	return (
		<>
			<span className={css} style={style}>
				<input type="file"
					name="csvInp"
					id="csvInp"
					className={"inputfile "+inputCss}
					multiple={multiple}
					onChange={onChange}
					key={text}
					accept=".csv"/>
				<label htmlFor="csvInp" className={labelCss}>{text}</label>
			</span>
		</>
	)
}
