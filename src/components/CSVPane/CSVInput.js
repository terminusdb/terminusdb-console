import React, {useState} from 'react'

export const CSVInput = ({id, css, style, inputCss, onChange, text, multiple, labelCss, acceptType}) =>{
	var inp, types;
	if(id == undefined) inp="csvInp"
	else inp=id
	if(acceptType==undefined) types=".csv"
	else types=acceptType
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
					accept={types}/>
				<label htmlFor={inp} className={labelCss}>{text}</label>
			</span>
		</>
	)
}
