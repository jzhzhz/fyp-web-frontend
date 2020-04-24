import React from 'react';
import HomeCarousel from './components/HomeCarousel';
import { Jumbotron } from './components/Jumbotron';
import { Container, Row, Col } from 'react-bootstrap';
import HomeCard from './components/HomeCard';

// inputs for cards in home page
const newsCard = {
  title: "News",
  textList: [
    "Share walls stuff think but the arise guest.",
    "Of shameless collected suspicion existence in.",
    "Now busy say down the shed eyes roof paid her."
  ],
  url: "/about/news"
};

const researchCard = {
  title: "Research",
  textList: [
    "Some quick example text to build on the card.",
    "Title and make up the bulk of the card's content.",
    "Share walls stuff think but the arise guest."
  ],
  url: "research"
};

export const Home = () => (
  <React.Fragment>
    <Jumbotron />
    <Container>
      <Row>
        <Col sm={9}>
          <h2>Headline Information</h2>
          <hr />

          <HomeCarousel />
          <hr />

          <Row>
            <Col>
              <HomeCard 
                title={newsCard.title} 
                textList={newsCard.textList}
                url={newsCard.url} 
              />
            </Col>
            <Col>
              <HomeCard 
                title={researchCard.title} 
                textList={researchCard.textList} 
                url={researchCard.url}
              />
            </Col>
          </Row>
          <hr />
          
          <Row>
            <Col>
              <h3>Academics  <span><a href="/" style={{fontSize: "small", color: "grey"}}>[MORE]</a></span></h3>
              <p>Course suffer to do he sussex it window advice. </p>
              <p>Her indulgence but assistance favourable cultivated everything collecting. </p>
              <p>Yet matter enable misery end extent common men should.</p>
              <hr />
            </Col>
          </Row>
        </Col>
        <Col sm={3}>
          <h5>Side Line Information</h5>
          <p>Or kind rest bred with am shed then. In raptures building an bringing be.</p>
          <p>Better of always missed we person mr. September smallness northward situation few her certainty something. </p>
          <br />
          <h5>Jumbotron Lennister</h5>
          <p>Better of always missed we person mr. September smallness northward situation few her certainty something.</p>
          <p>Search for the keywords to learn more about each warning.</p>
          <p>To ignore, add // eslint-disable-next-line to the line before.</p>
        </Col>
      </Row>
    </Container>
  </React.Fragment>
)