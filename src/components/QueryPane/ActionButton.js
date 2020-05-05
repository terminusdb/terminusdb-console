import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import * as tag from "../../labels/tags"
import * as lang  from "../../labels/queryFormats";
import { parseText } from "../../utils/format"
import { commitBox } from "../../variables/formLabels"

export const ActionButton = (props) => {
    const { register, handleSubmit, errors } = useForm();
    const text = props.text || tag.SUBMIT
    const isQuery = props.isQuery || false;
    const lang = props.lang || lang.WOQL_JS
    const inputQuery = props.inputQuery || false;
    const setWoql = props.setWoql;
    const inputRule = props.inputRule || false;
    const setRule = props.setRule;
    const setReport = props.setReport;
    const setCommitMsg = props.setCommitMsg;
    const [showCommitBox, setShowCommitBox] = useState(false);

    const handleQuery = () => {
        if(isQuery){
            const q = parseText(inputQuery, lang, tag.QUERY);
            if(!q){
        		let message = "Query could not be extracted from input box - "
                    + "remember that the last element in the query must be a WOQL object"
                setReport({status: tag.ERROR, error: message})
        	}
            else{
                //show the commit message box
                if(q.containsUpdate())
                    setShowCommitBox(true)
                else setWoql(q);
            }
        }
        else {
            const r = parseText(inputRule, lang, tag.RULE);
            setRule(r);
        }
    }

    const handleCancel = () => {
        setShowCommitBox(false);
    }

    const onCommit = (data) =>{
        const q = parseText(inputQuery, lang, tag.QUERY);
        if(!q){
    		let message = "Query could not be extracted from input box - "
                + "remember that the last element in the query must be a WOQL object"
            setReport({status: tag.ERROR, error: message})
    	}
        else{
            setCommitMsg(data.commitMessage)
            setWoql(q);
        }
    }

    return(
       <>
          {showCommitBox &&
              <form onSubmit={ handleSubmit(onCommit) }>
                  <label className =  { commitBox.label.className }>
                       {commitBox.label.text}
                  </label>
                  <textarea name= { commitBox.input.name }
                     placeholder = { commitBox.input.placeholder }
                     ref = { register } />
                 <span className = "dl-fl">
                     <button className = { commitBox.confirm.className }
                         type =  { commitBox.confirm.type } >
                         { commitBox.confirm.text }
                     </button>
                     <button className = { commitBox.cancel.className }
                         type =  { commitBox.cancel.type }
                         onClick = { handleCancel }>
                         { commitBox.cancel.text }
                     </button>
                 </span>
              </form>}
          {!showCommitBox && <button onClick = { handleQuery }> { text } </button>}
       </>
    )

}
