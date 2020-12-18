import React, {useState} from 'react'

export const CSVInput = ({id, css, style, inputCss, onChange, text, multiple, labelCss}) =>{
	var inp ;
	if(id == undefined) inp="csvInp"
	else inp=id
	return (
		<>
			<span className={css} style={style}>
				<input type="file"
					name={inp}
					id={inp}
					className={"inputfile "+inputCss}
					multiple={multiple}
					onChange={onChange}
					key={text}
					accept=".csv"/>
				<label htmlFor={inp} className={labelCss}>{text}</label>
			</span>
		</>
	)
}
