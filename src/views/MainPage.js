import React from "react";
import { Container, Row, Col ,Jumbotron,Button} from "reactstrap";

import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-spa";

const MainPage = (props) => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <Container fluid className="mt-5 pr-0 pl-0">
      <Row className="profile-header mb-12 text-center text-md-left">
        <aside className="left-aside-column col-12 col-md-4 col-lg-3 bg-white border-right hide-md hide-sm">
           <span className="user-info">
            <img
              src={user.picture}
              alt="Profile"
              className="nav-user-profile d-inline-block rounded-circle mr-3"
              width="50"
            />
            <h6 className="d-inline-block">{user.name}</h6>
           </span>
          <hr className="my-2 mt-3" />
          <p className="lead text-right">
            <Button color="primary" onClick={()=> {props.history.replace('/newDB')}}>+ New Database</Button>
          </p>
          <div md className="mt-4 d-flex flex-column">
            <span><h6 className="d-inline-block">terminus/test01</h6></span>
            <span><h6 className="d-inline-block">terminus/test02</h6></span>
          </div>
        </aside>
        <Col md>
          <Container fluid className="border">
              <h4 >About terminusHub</h4>
              <p className="lead">Structured, semantically meaningful data for rapid delivery of data driven applications. Join the data-centric revolution!.</p>
          </Container>
        <Jumbotron fluid>
        <Container fluid>
          <h4 >About terminusHub</h4>
          <p className="lead">Structured, semantically meaningful data for rapid delivery of data driven applications. Join the data-centric revolution!</p>
        </Container>
      </Jumbotron>
       <Jumbotron fluid>
        <Container fluid>
          <h4 >About terminusHub</h4>
          <p className="lead">Structured, semantically meaningful data for rapid delivery of data driven applications. Join the data-centric revolution!</p>
        </Container>
      </Jumbotron>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
