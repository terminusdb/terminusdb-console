import React, { useState } from 'react';
import Select from "react-select";

const BranchSelector = (props) => {
    const [values, setReactSelect] = useState({
      selectedOption: []
    });

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
