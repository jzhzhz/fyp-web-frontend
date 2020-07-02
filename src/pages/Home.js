import React from 'react';
import { Row, Col, CardDeck } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import * as Utils from '../utils/Utils';
import styled from 'styled-components';

import HomeCarousel from '../components/HomeCarousel';
import HomeCard from '../components/HomeCard';

/** home page for the website */
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
      cardReactElements: [],
      eventsCards: [],
      eventsCardsElements: []
    };
  }

  /** call functions to get all home page information */
  componentDidMount() {
    this.getTextBlocksByType("headline");
    this.getTextBlocksByType("sidebar");
    this.getCards();
    this.getEventsCards();
  }

  componentWillUnmount() {
    // disable setState action when unmounting components
    this.setState = (state, callback)=>{
      return;
    };
  }

  /** get dynamic contents like jumbotron and headline */
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
        this.setState({
          [type]: res.data.data[0]
        });
    }
  }

  /** get home page cards information */
  getCards = async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/getAllCards";
    
    const res = await axios.get(url)
      .catch((err) => {
        console.log(err);
        return -1;
      });

    if (res.status === 200 && res.data.code === 0) {
      let resData = res.data.data;
      
      // construct image fetching url
      resData.forEach(item => {
        const url = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
          + "visitUrl=" + encodeURIComponent(item.imgUrl);
        
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

  /** get events info in home page bottom sidebar */
  getEventsCards = async () => {
    const url = process.env.REACT_APP_BACKEND_URL +
    "/getAllEvents";
  
    const res = await axios.get(url)
      .catch((err) => {
        console.log(err);
        return -1;
      });

    if (res.status === 200 && res.data.code === 0) {
      this.setState({
        eventsCards: res.data.data
      }, () => {
        this.renderEventsCard(this.state.eventsCards.slice());
      });
    }
  }

  /** transform the cards backend info to react elements */
  modifyCardToReactElement = (cardsArr) => {
    // group the original card array by 2 as a new list
    // e.g. [1, 2, 3, 4] => [[1, 2], [3, 4]]
    cardsArr = Utils.chunkArray(_.cloneDeep(cardsArr), 2);

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

    this.setState({
      cardReactElements: _.cloneDeep(cardsArr)
    });
  }

  /** transform the events backend info to react elements */
  renderEventsCard = (eventsCards) => {
    const cardElements = eventsCards.map((card, cardIndex) => 
      <div key={`events ${cardIndex}`}>
        <p style={{marginBottom: "2px"}}><b>
          <a href={card.url} style={{color: "black"}}>{card.title}</a>
        </b></p>
        <p style={{marginBottom: "2px", fontSize: "smaller", color: "gray"}}>{card.subtitle}</p>
        <p>{card.content}</p>
        <br />
      </div>
    );

    this.setState({
      eventsCardsElements: cardElements
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
            </Col>
            <Col sm={3}>
              <SidebarStyles>
                <div dangerouslySetInnerHTML={{__html: this.state.sidebar.content}} />
              </SidebarStyles>
            </Col>
          </Row>
          <Row>
            <Col sm={9}>
              <h3>News</h3>
              <hr />
              {this.state.cardReactElements}
              <br />
            </Col>
            <Col sm={3}>
              <h3>Events</h3>
              <hr />
              <div>
                {this.state.eventsCardsElements}
              </div>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

const SidebarStyles = styled.div`
  p {
    margin-bottom: 8px;
  }

  blockquote {
    border-left: 5px solid #eee;
    color: #666;
    font-family: 'Hoefler Text', 'Georgia', serif;
    font-style: italic;
    margin: 16px 0;
    padding: 10px 20px;
  }
`;

export default Home;