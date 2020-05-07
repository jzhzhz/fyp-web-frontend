import React from 'react';
import HomeCarousel from './components/HomeCarousel';
import axios from 'axios';
import _ from 'lodash';

import { Row, Col } from 'react-bootstrap';
import { Player } from 'video-react';
import "../node_modules/video-react/dist/video-react.css";
import HomeCard from './components/HomeCard';

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
      cardReactElements: []
    };
  }

  componentDidMount() {
    this.getTextBlocksByType("headline");
    this.getTextBlocksByType("sidebar");
    this.getTextBlocksByType("cards");
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
        this.getCardTextBlocks(res.data.data);
      }
    }
  }

  getCardTextBlocks = (resData) => {
    let cardArray = [];

    resData.forEach((item) => {
      let cardTemp = {};

      cardTemp.id = item.id;
      cardTemp.title = item.title;
      cardTemp.textList = item.content.split("*SEP*").filter(item => item);
      cardTemp.url = item.url;
      cardTemp.changed = false;

      cardArray.push(cardTemp);
    });

    this.setState({
      cards: _.cloneDeep(cardArray)
    });

    this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
  }

  modifyCardToReactElement = (cardsArr) => {
    cardsArr = cardsArr.map((card, cardIndex) => {
      const lineBreak = (cardIndex + 1) === cardsArr.length ?
        null : <br key={cardIndex+1}/>;
      return (
        <div key={cardIndex}>
          <HomeCard
            key={cardIndex} 
            title={card.title} 
            textList={card.textList}
            url={card.url} 
          />
          {lineBreak}
        </div>
      );
    }
    );

    this.setState({
      cardReactElements: _.cloneDeep(cardsArr)
    });
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

              {this.state.cardReactElements}
              <hr />
              
            </Col>
            <Col sm={3}>
              <div dangerouslySetInnerHTML={{__html: this.state.sidebar.content}} />
              <hr />

              <Player
                playsInline
                poster="./pictures/aurora.jpg"
                src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              />
              <hr />

            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;