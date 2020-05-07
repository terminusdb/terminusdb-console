import React, { useState } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";
import { Button, Container } from "reactstrap"
import { useForm } from 'react-hook-form';
import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-spa";
import { UserCard } from "../components/Card/UserCard"
import { FormInputs } from "../components/Form/FormInputs"
import { Card } from "../components/Card/Cards"
import { CardDecks } from "../components/Card/CardDeck";
//import { PaymentModal } from "../components/Modals/Payment";

const Profile = () => {
  const { loading, user } = useAuth0();
  const [ modal, setModal ] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [ edit, setEdit ] =  useState(false);
  const toggle = () => setModal(!modal);

  if (loading || !user) {
    return <Loading />;
  }

  const clickEdit = () => {
      setEdit(true)
  }

  const clickCancel = () =>{
      setEdit(false)
  }

  const onSubmit = (data) => {
      console.log('commit something')
  };

  return (
      <Container fluid className="h-100 pl-0 pr-0">
          <Container className="flex-grow-1">
            <hr className="my-5"/>
            <div className="content">
              <Grid fluid>
                <Row>
                <Col md={4} className="user-card">
                  <UserCard bgImage={'https://terminusdb.com/img/placeholders/half-background-mobile.png'}
                     avatar={user.picture}
                     name={user.name}
                     userName={user.nickname}
                     description={<span>
                                    Some description about me
                                  </span>}/>
                </Col>
                <Col md={8}>
                    <Card
                      title="Profile"
                      content={
                        <form onSubmit={ handleSubmit(onSubmit) }>
                          <FormInputs
                            ncols={["col-md-5", "col-md-7"]}
                            properties={[
                              {
                                label: "Account",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Company",
                                defaultValue: "AccountName",
                                readOnly: (!edit)
                              },
                              {
                                label: "Email address",
                                type: "email",
                                bsClass: "form-control",
                                placeholder: "Email",
                                readOnly: (!edit)
                              }
                            ]}
                          />
                          {(!edit) && <Button color="primary" onClick={clickEdit}>
                              Edit </Button>}
                          {(edit) && <><Button color="primary pr"
                              type = "Submit">
                              Save </Button>
                              <Button color="primary"
                                  onClick={clickCancel}
                                  type = "Submit">
                                  Cancel </Button></>}
                          <hr className="my-space-100"/>
                          <hr className="my-2"/>
                          <hr className="my-space-25"/>
                          <legend className="pr-hding-sp">{'Current Plan'}</legend>
                          <hr className="my-space-25"/>
                          <CardDecks/>
                          <hr className="my-space-50"/>
                          <Button color="primary" onClick={toggle}> Upgrade </Button>
                          <div className="clearfix" />
                        </form>
                      }
                    />
                  </Col>
                </Row>
              </Grid>
            </div>
          </Container>
       </Container>
  );
 }


/*  return (
      <Container fluid className="h-100 pl-0 pr-0">
          <NavBar />
          <Container className="flex-grow-1">
              <hr className="my-5" />
              <Col md={4}>
                <UserCard bgImage="https://terminusdb.com/img/cards/card-shape-3.svg"
                          avatar={user.picture}
                          name={user.nickname}
                          email={user.email}
                          description={
                                <span>
                                  Some description about Kitty
                                </span>}
                                socials={
                                    <div>
                                      <Button simple>
                                        <i className="fa fa-twitter" />
                                      </Button>
                                      <Button simple>
                                        <i className="fa fa-google-plus-square" />
                                      </Button>
                                      <Button simple>
                                        <i className="fa fa-github" />
                                      </Button>
                                    </div>}/>
              </Col>
      </Container>
    </Container>
);
};*/

/*
<Row className="profile-header mb-6 text-center text-md-left">
  <Col md={3}>
     <img
      src={user.picture}
      alt="Profile"
      className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
    />
    <p className="lead">{user.name}</p>
    <hr className="my-2" />
    <p className="lead">
      <Button color="primary " style={{width:'100%'}}>Edit Profile</Button>
    </p>
  </Col>
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
*/

export default Profile;
