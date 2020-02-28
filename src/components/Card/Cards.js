import React from "react";

export const Card = (props) => {
    return (
      <div className={"card" + (props.plain ? " card-plain" : "")}>
        <hr className="my-space" />
        <div className={"header" + (props.hCenter ? " text-center" : "")}>
          <legend className="user-card-title">{props.title}</legend>
          <p className="category">{props.category}</p>
        </div>
        <hr className="my-space" />
        <div
          className={
            "content" +
            (props.ctAllIcons ? " all-icons" : "") +
            (props.ctTableFullWidth ? " table-full-width" : "") +
            (props.ctTableResponsive ? " table-responsive" : "") +
            (props.ctTableUpgrade ? " table-upgrade" : "")
          }
        >
        <hr className="my-5"/>
          {props.content}
        </div>
      </div>
    );
}
