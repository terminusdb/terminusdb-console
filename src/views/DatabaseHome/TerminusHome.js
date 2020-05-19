import React, { useState, useEffect } from "react";
import { PageView } from '../PageView'
import { TCForm } from  "../../components/Form/FormComponents"
import { TERMINUS_SUCCESS, TERMINUS_ERROR, TERMINUS_WARNING, TERMINUS_INFO} from "../../constants/identifiers"


//export const TCForm = ({onSubmit, onChange, report, fields, buttons, layout, validate, containerClassName, children}) => {    




const TerminusHome = (props) => {
    let field = {
        id: "xx", 
        value: "xxxxs",

        inputElement: {
            type: "input",
            placeholder: "xxxh "
            //disabled ={elt.disabled}
            //value={elt.value}
            //className={elt.className}
        },
        //mandatory={field.mandatory}
        //className={field.className}
        label: "lab",
        //labelClassName ={field.labelClassName} 
        help: "halp"
        //helpExpanded = {field.helpExpanded} 
        //helpRowClassName = {field.helpRowClassName} 
        //helpClassName = {field.helpClassName}
        //helpLabelColClassName = {field.helpLabelColClassName} 
        //helpColClassName = {field.helpColClassName}
        //helpCols = {field.helpCols}
        //promptRowClassName = {field.promptRowClassName}
        //inputRowClassName = {field.inputRowClassName}
        //inputGutterClassName = {field.inputGutterClassName}
        //cowDuckClassName = {field.cowDuckClassName}
        //cowDuckIconClassName = {field.cowDuckIconClassName} 
        //errorRowClassName = {field.errorRowClassName}
        //error = {field.error}
        //fieldErrorClassName = {field.fieldErrorClassName}
    }

    let field2 = {
        id: "xx2", 
        value: "",
        inputElement: {
            type: "input",
            placeholder: "xxxh ",
        },
        mandatory: true,
        //className: "xcf",
        label: "xx2",
        //labelClassName ={field.labelClassName} 
        help: "AND WE AWEAO ADSJA DLADLA JDSAJ DADS AD S",
        helpExpanded: true, 
        //inputRowClassName: "xcf",
        //helpRowClassName: "xcf", 
        //helpClassName: "xcf",
        //helpLabelColClassName: "xcf", 
        //helpColClassName: "xcf",
        //helpCols: 8,
        //promptRowClassName: "xcf"
        //inputRowClassName: "xcf",
        //inputGutterClassName: "xcf"
        //cowDuckClassName: "xcf",    
        //badcowDuckIconClassName: "xcf" 
        //errorRowClassName: "xcf",
        //error: "higglety"
        //fieldErrorClassName: "xcf"
    }

    let field3 = {
        id: "x3", 
        value: "",
        inputElement: {
            type: "select",
            placeholder: "xxxh ",
            options: [{value: "x", "label": "X"}]
        },
        //mandatory={field.mandatory}
        className: "xcf",
        label: "sel",
        //labelClassName ={field.labelClassName} 
        help: "halp"
        //helpExpanded = {field.helpExpanded} 
        //helpRowClassName = {field.helpRowClassName} 
        //helpClassName = {field.helpClassName}
        //helpLabelColClassName = {field.helpLabelColClassName} 
        //helpColClassName = {field.helpColClassName}
        //helpCols = {field.helpCols}
        //promptRowClassName = {field.promptRowClassName}
        //inputRowClassName = {field.inputRowClassName}
        //inputGutterClassName = {field.inputGutterClassName}
        //cowDuckClassName = {field.cowDuckClassName}
        //cowDuckIconClassName = {field.cowDuckIconClassName} 
        //errorRowClassName = {field.errorRowClassName}
        //error = {field.error}
        //fieldErrorClassName = {field.fieldErrorClassName}
    }

    let field4 = {
        id: "x4", 
        value: false,
        inputElement: {
            type: "textarea",
            placeholder: "x   xxh ",
        },
        //mandatory={field.mandatory}
        //className={field.className}
        label: "x4",
        //labelClassName ={field.labelClassName} 
        help: "halp"
    }

    let field5 = {
        id: "x5", 
        value: true,
        inputElement: {
            type: "checkbox",
            label: "blah", 
            //wrapperClassName, labelClassName,
         },
        //className={field.className}
        label: "x5",
        //labelClassName ={field.labelClassName} 
        help: "halp"
    }

    

    let fields = [field3, field5, field3, field2, field, field5, field5]

    let layout = [2, 3, 4]

    let buttons = {
        //className: "xcf",
        //buttonsClassName: "xcf",
        onCancel: function(){alert("c")},
        cancelText: "buttons.cancelText",
        submitText: "buttons.submitText",
    }

    let config = {
        fields: fields,
        buttons: buttons
    }


    let report = false
    function genReport(){
        alert("yoyo")
        report = { status: "info", message: "loud and clear" }
    }
    //onchange
    //validate
    //containerClassCname
    //layout
    return (  
        <PageView>
            <TCForm 
                onSubmit={genReport} 
                report={report} 
                layout = {layout}
                fields={config.fields}
                buttons={config.buttons} 
            />    
        </PageView>   
	)
}
export default TerminusHome;

