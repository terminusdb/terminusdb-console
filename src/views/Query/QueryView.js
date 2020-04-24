import React, { useState } from "react";
import { Container , Col, Button } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import Loading from "../../components/Loading";
import NavBar from '../../components/NavBar';

import { Preview } from "../../components/QueryPane/Preview" // temp test

const Query = (props) => {

  const { loading, user } = useAuth0();

  if (loading) return <Loading />;

  return (
      <Container fluid className="h-100 pl-0 pr-0">
          <NavBar/>
    	  <Container className="flex-grow-1">
            {/*<NewQueryPane/>*/}
            {<Preview/>}
    	  </Container>
      </Container>
    )
}

export default Query;
