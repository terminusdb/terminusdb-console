import React from "react";

// get description
const ExpandedComponent = (props) => {
  var description;
  for (let itemId of Object.keys(props.data)){ // props.data gets row info
      var key = props.data[itemId];
      if(itemId == 'rdfs:comment')
          description = key;
  }
  return (<div><p className="dscr">{ description }</p></div>)
};

export default ExpandedComponent
