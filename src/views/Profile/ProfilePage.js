import React, { useState } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Button } from "reactstrap"
import { useForm } from 'react-hook-form';
import Loading from "../../components/Loading";
import { useAuth0 } from "../../react-auth0-spa";
import { UserCard } from "../../components/Card/UserCard"
import { FormInputs } from "../../components/Form/FormInputs"
import { Card } from "../../components/Card/Cards"
import { CardDecks } from "../../components/Card/CardDeck";
import { PageView } from '../PageView'

const ProfilePage = () => {
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
      <PageView page="/profile">
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
      </PageView>
  )
 }

export default ProfilePage;
