import React from "react";
import { AddIcon } from "./LoadFontAwesome"

const CategoryHeading = (props) => {
    return (
        <span class="subCategoryIcons display-flex">
            <AddIcon icon= {props.category.icon} />
            <h3 className ="category"> {props.category.label} </h3>
        </span>
    )
}

export default CategoryHeading;
