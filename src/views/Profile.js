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
import Loading from "../components/Loading";
import { useAuth0 } from "../react-auth0-spa";
import NavBar from "../components/NavBar"
import { UserCard } from "../components/Card/UserCard"
import { FormInputs } from "../components/Form/FormInputs"
import { Card } from "../components/Card/Cards"
import { CardDecks } from "../components/Card/CardDeck";
import { PaymentModal } from "../components/Modals/Payment";

const Profile = () => {
  const { loading, user } = useAuth0();
  const [ modal, setModal ] = useState(false);
  const toggle = () => setModal(!modal);

  if (loading || !user) {
    return <Loading />;
  }


  return (
      <Container fluid className="h-100 pl-0 pr-0">
          <NavBar resetDB = {true}/>
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
                        <form>
                          <FormInputs
                            ncols={["col-md-5", "col-md-3", "col-md-4"]}
                            properties={[
                              {
                                label: "Company",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Company",
                                defaultValue: "datachemist",
                                disabled: true
                              },
                              {
                                label: "Username",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Username",
                                defaultValue: "kitzkan"
                              },
                              {
                                label: "Email address",
                                type: "email",
                                bsClass: "form-control",
                                placeholder: "Email"
                              }
                            ]}
                          />
                          <FormInputs
                            ncols={["col-md-6", "col-md-6"]}
                            properties={[
                              {
                                label: "First name",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "First name",
                                defaultValue: "Kitty"
                              },
                              {
                                label: "Last name",
                                type: "text",
                                bsClass: "form-control",
                                placeholder: "Last name",
                                defaultValue: "Jose"
                              }
                            ]}/>
                          <hr className="my-space"/>
                          <Button color="primary"> Edit </Button>
                          <hr className="my-space"/>
                          <legend className="pr-hding-sp">{'Current Plan'}</legend>
                          <hr className="my-3"/>
                          <CardDecks/>
                          <hr className="my-space"/>
                          <Button color="primary" onClick={toggle}> Upgrade </Button>
                          <PaymentModal isOpen={modal} toggle={toggle}/>
                          <hr className="my-space"/>
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
export default Profile;
