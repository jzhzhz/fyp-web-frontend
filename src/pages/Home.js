import React from 'react';
import HomeCarousel from '../components/HomeCarousel';
import axios from 'axios';
import _ from 'lodash';
import * as Utils from '../utils/Utils';

import { Row, Col, CardDeck } from 'react-bootstrap';
import HomeCard from '../components/HomeCard';

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
    this.getCards();
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

        this.setState({
          [type]: resData
        });
      } 
    }
  }

  getCards = async () => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getAllCards";
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
        return -1;
      });

    // assign cards in state 
    // and set the old card list length
    if (res.status === 200 && res.data.code === 0) {
      let resData = res.data.data;
      
      resData.forEach(item => {
        const url = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
          + "visitUrl=" + encodeURIComponent(item.imgUrl);

        item.changed = false;
        item.imgUrl = url;
      });

      this.setState({
        cards: resData,
        oldCardsLength: resData.length
      });

    } else { return -1; }

    this.modifyCardToReactElement(_.cloneDeep(this.state.cards));

    return 0;
  }

  modifyCardToReactElement = (cardsArr) => {
    cardsArr = Utils.chunkArray(_.cloneDeep(cardsArr), 2);
    console.log(cardsArr);

    cardsArr = cardsArr.map((twoCards, cardIndex) => {
      // const lineBreak = (cardIndex + 1) === cardsArr.length ?
      //   null : <br key={cardIndex+1}/>;

      const secondCard = twoCards[1] ? 
        <HomeCard 
          key={`deck${cardIndex}card1`} 
          title={twoCards[1].title} 
          text={twoCards[1].text}
          date={twoCards[1].date}
          url={twoCards[1].url} 
          imgUrl={twoCards[1].imgUrl}
        /> : null;
      
      return (
        <div key={`div${cardIndex}`}>
          <CardDeck key={cardIndex}>
            <HomeCard
              key={`deck${cardIndex}card0`} 
              title={twoCards[0].title} 
              text={twoCards[0].text}
              date={twoCards[0].date}
              url={twoCards[0].url} 
              imgUrl={twoCards[0].imgUrl}
            />
            {secondCard}
          </CardDeck>
          <br key={`br${cardIndex}`}/>
        </div>
      );
    });

    console.log(cardsArr);

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
              <br />
              <br />

              {/* <a target="_blank" href="https://google.com" rel="noopener noreferrer">test</a> */}

              <h3>News</h3>
              <hr />
              {this.state.cardReactElements}
              <hr />
            </Col>
            <Col sm={3}>
              <div dangerouslySetInnerHTML={{__html: this.state.sidebar.content}} />
              <hr />

            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;