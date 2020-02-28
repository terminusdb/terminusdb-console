import React, { Fragment } from "react";

import Hero from "../components/Hero";
import Content from "../components/Content";
import NavBar from "../components/NavBar";
const Home = () => (
 
  <Fragment >
  	<NavBar/>
    <Hero />
    <hr />
    <Content />
  </Fragment>
);

export default Home;
