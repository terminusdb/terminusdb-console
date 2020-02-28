import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">    
    <h1 className="mb-4">The platform for modern applications</h1>

    <p className="lead">
      This library implements a way to store triple data - data that consists of a subject, predicate and an object, where object can either be some value, or a node (a string that can appear both in subject and object position).
    </p>
  </div>
);

export default Hero;

//<!--<img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />-->
