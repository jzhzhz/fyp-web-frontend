import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

const Styles = styled.div`
  a {
    color: #6097c4;
  }

  .pubCard a {
    font-size: small;
  }

  hr {
    margin-top: 5px;
  }
`;

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      chosenFaculty: {
        id: "",
        name: "",
        username: "",
        phone: "",
        office: "",
        email: "",
        url: "",
      },
      generalProfile: {
        intro: "",
        sidebar: "",
        imgUrl: ""
      },
      newsCards: [],
      pubCards: [],
      newsCardElements: [],
      pubCardElements: []
    }
  }

  componentDidMount() {
    // get all detailed information
    const retUsername = this.props.match.params.name;

    this.getFacultyInformation(retUsername);
    this.getGeneralProfile(retUsername);
    this.getCards(retUsername, "news");
    this.getCards(retUsername, "pub");
  }

  getFacultyInformation = async (username) => {
    const url = process.env.REACT_APP_FACULTY_URL + "/getFacultyByUsername?username=" + username;

    const res = await axios.get(url)
    .catch((err) => {
      console.log(err);
      return -1;
    });
    
    if (res.status === 200 && res.data.code === 0) {
      const retChosenFaculty = res.data.data[0];

      this.setState({
        chosenFaculty: retChosenFaculty
      });
    }
  }

  getGeneralProfile = async (username) => {
    const url = process.env.REACT_APP_FACULTY_URL +
    "/getGeneralProfile?username=" + username;
  
    const res = await axios.get(url)
    .catch((err) => {
      console.log(err);
      return -1;
    });
  
    if (res.status === 200 && res.data.code === 0) {
      const retGeneralProfile = res.data.data[0];

      this.setState({
        generalProfile: retGeneralProfile
      });
    }
  }

  getCards = async (username, type) => {
    let url = "";
    if (type === "news") {
      url = process.env.REACT_APP_FACULTY_URL +
      "/getProfileCustom?username=" + username;
    } else if (type === "pub") {
      url = process.env.REACT_APP_FACULTY_URL +
      "/getProfileCard?username=" + username;
    }

    const res = await axios.get(url)
    .catch((err) => {
      console.log(err);
      return -1;
    });
    
    if (res.status === 200 && res.data.code === 0) {
      if (type === "news") {
        this.setState({
          newsCards: res.data.data
        }, () => {
          this.renderNewsCardElements(this.state.newsCards.slice());
        });
      } else if (type === "pub") {
        this.setState({
          pubCards: res.data.data
        }, () => {
          this.renderPubCardsElements(this.state.pubCards.slice());
        });
      }
    }
  }

  renderNewsCardElements = (newsCards) => {
    const cardElements = newsCards.map((card, cardIndex) =>
      <Row key={`newsCard${cardIndex}`}>
        <Col sm={"auto"} style={{paddingRight: "0px"}}>
          <p>{card.dateBar}</p>
        </Col>
        <Col>
          <div dangerouslySetInnerHTML={{__html: card.codeSegment}}/>
        </Col>
      </Row>
    );

    this.setState({
      newsCardElements: cardElements
    });
  }

  renderPubCardsElements = (pubCards) => {
    const cardElements = pubCards.map((card, cardIndex) => {
      const fullImgUrl = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
      + "visitUrl=" + encodeURIComponent(card.imgUrl);

      return (
        <Row className="pubCard" key={`pubCard${cardIndex}`} style={{marginBottom: "25px"}}>
          <Col sm={"auto"} style={{paddingRight: "5px", paddingBottom: "10px"}}>
            <img 
              src={fullImgUrl}
              alt="profile"
              height="142" width="230"
            />
          </Col>
          <Col>
            <p style={{marginBottom: "2px"}}><b>{card.title}</b></p>
            <p style={{marginBottom: "2px", fontSize: "0.85em", color: "gray"}}>{card.subtitle}</p>
            <p style={{marginBottom: "1px"}}>
              {card.text}   
            </p>
            <a href={card.url} style={{fontSize: "0.7em"}}>[MORE]</a>
          </Col>
        </Row>
      ); 
    });

    this.setState({
      pubCardElements: cardElements
    });
  }
  
  render() {
    const fullImgUrl = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
    + "visitUrl=" + encodeURIComponent(this.state.generalProfile.imgUrl);

    return (
      <Styles>
      <React.Fragment>
        <h3>{this.state.chosenFaculty.name}</h3>
        <hr />
        <Row>
          <Col sm={3}>
            <Image src={fullImgUrl} rounded style={{width: "100%", height: "300px"}}/>
            <br />
            <br />
            <div>
              <h5>Contact Information</h5>
              <hr />
              <p><b>Phone:</b> {this.state.chosenFaculty.phone}</p>
              <p><b>Office:</b> {this.state.chosenFaculty.office}</p>
              <p><b>E-mail:</b> {this.state.chosenFaculty.email}</p>
            </div>
            <br />

            <div dangerouslySetInnerHTML={{__html: this.state.generalProfile.sidebar}} />
          </Col>
          <Col sm={9}>
            <div className="main profile">
              <div dangerouslySetInnerHTML={{__html: this.state.generalProfile.intro}} />
              <br />

              <h5>News</h5>
              <hr />
              {this.state.newsCardElements}
              <br />

              <h5>Publications</h5>
              <hr />
              {this.state.pubCardElements}
            </div>
          </Col>
        </Row>
        <br />
      </React.Fragment>
      </Styles>
    );
  }
}

export default Profile;
