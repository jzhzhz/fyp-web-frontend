import React from 'react';
import HomeCarousel from './components/HomeCarousel';
import { Jumbotron } from './components/Jumbotron';
import { Container, Row, Col } from 'react-bootstrap';

export const Home = () => (
  <React.Fragment>
    <Jumbotron />
    <Container>
      <Row>
        <Col sm={10}>
          <h2>Headline Information</h2>
          <hr />
          <HomeCarousel />
          <hr />
          <h3>News</h3>
          <p>venauvboabvoueboabceounbvqv</p>
          <p>beuvabu9qbvieubviwqe</p>
          <p>bceoabvuobvuoe</p>
          <p>Indulgence announcing uncommonly met she continuing two unpleasing terminated. Now busy say down the shed eyes roof paid her. Of shameless collected suspicion existence in. Share walls stuff think but the arise guest. Course suffer to do he sussex it window advice. Yet matter enable misery end extent common men should. Her indulgence but assistance favourable cultivated everything collecting. </p>
          <hr />
        </Col>
        <Col sm={2}>
          <h5>side line information</h5>
          <p>Or kind rest bred with am shed then. In raptures building an bringing be.</p>
          <p>Better of always missed we person mr. September smallness northward situation few her certainty something. </p>
        </Col>
      </Row>
    </Container>
  </React.Fragment>
)