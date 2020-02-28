import React from "react";

export const UserCard = (props) => {
    return (
      <div className="card card-user">
          <div className="user-card-bg">
              <img src={props.bgImage} alt="..." />
          </div>
         <div className="content">
            <div className="user-pic">
               <a href="#pablo">
                  <img className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                       src={props.avatar}
                       alt="..."/>
                  <hr className="my-space" />
                  <h4 className="title">
                      {props.name}
                      <br/>
                      <small>{props.email}</small>
                  </h4>
                  <hr className="my-space"/>
               </a>
           </div>
           <p className="description text-center">{props.description}</p>
        </div>
        <hr />
   </div>
);}
