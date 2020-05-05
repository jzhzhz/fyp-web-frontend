import React from 'react';
import HomeCarousel from './components/HomeCarousel';
import axios from 'axios';

import { Row, Col } from 'react-bootstrap';
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
  url: "/research"
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      headline: {
        id: 0,
        title: "",
        content: "",
        url: "",
      },
      jumbo: {
        id: 0,
        title: "",
        content: "",
        url: "",
      },
      sidebar: {
        id: 0,
        title: "",
        content: "",
        url: "",
      },
      cards: [],
      sidebarTest: "<h5>Sidebar HTML Test</h5><p>This is to test the use of innerhtml in this sidebar. To see if it will actually work</p>"
    };
  }

  componentDidMount() {
    this.getTextBlocksByType("headline");
    this.getTextBlocksByType("sidebar");
  }

  getTextBlocksByType = async (type) => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getHomeTextBlockByType?type=" + type;
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
      });

    if (res.status === 200 && res.data.code === 0) {
      if (type !== "cards") {
        let resData = res.data.data[0];
        // resData.content = resData.contentList[0];

        this.setState({
          [type]: resData
        });

        console.log(this.state[type]);
      } else {
        this.getDynamicTextBlocks(res.data.data);
      }

      // console.log(this.state);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Row>
            <Col sm={9}>
              <h2>{this.state.headline.title}</h2>
              <hr />

              <HomeCarousel />
              <hr />

              <Row>
                <Col>
                  <HomeCard
                    key={newsCard.title} 
                    title={newsCard.title} 
                    textList={newsCard.textList}
                    url={newsCard.url} 
                  />
                </Col>
                <Col>
                  <HomeCard
                    key={researchCard.title}  
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
              <div dangerouslySetInnerHTML={{__html: this.state.sidebar.content}} />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;