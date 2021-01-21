import React, { useState } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Button } from "react-bootstrap" //replaced
import { useForm } from 'react-hook-form';
import Loading from "../../components/Reports/Loading";
import { useAuth0 } from "../../react-auth0-spa";
import { UserCard } from "../Users/UserCard"
import { FormInputs } from "../../components/Form/FormInputs"
import { Card } from "../Users/Cards"
import { CardDecks } from "../Users/CardDeck";
import { PageView } from '../Templates/PageView'
import { PROFILE_BG_IMAGE, USER_CARD_CSS, USER_DESCRIPTION_FILLER, PROFILE_TITLE, PROFILE_CONTENT_CSS } from "./constants.pages"

const ProfilePage = () => {
  const { loading, user } = useAuth0();

  const onSubmit = (data) => {
      console.log('commit something')
  };


  return (
      <PageView page="/profile">
          <hr className="my-5"/>
          <div className={PROFILE_CONTENT_CSS}>
            <Grid fluid>
              <Row>
              <Col md={4} className={USER_CARD_CSS}>
                <UserCard 
                    bgImage={PROFILE_BG_IMAGE}
                    avatar={user.picture}
                    name={user.name}
                    userName={user.nickname}
                    description={<span>{USER_DESCRIPTION_FILLER}</span>}
                />
              </Col>
              <Col md={8}>
                  <Card
                    title={PROFILE_TITLE}
                    content={<ProfileForm onSubmit={onSubmit} />}
                  />
                </Col>
              </Row>
            </Grid>
          </div>
      </PageView>
  )
 }

export default ProfilePage;
