import React from 'react';
import { Jumbotron as Jumbo, Container } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import jumboPic from '../assets/cs.jfif';

const Styles = styled.div`
  .jumbo {
    background: url(${jumboPic}) no-repeat fixed bottom;
    background-size: cover;
    color: #efefef;
    height: 200px;
    position: relative;
    z-index: -2;
  }
  .overlay {
    background-color: #000;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }
`;

class Jumbotron extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jumbo: {
        title: "",
        content: ""
      }
    };
  }

  componentDidMount() {
    this.getTextBlocksByType("jumbo");
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
        this.setState({
          [type]: res.data.data[0]
        });
      } 
    }
  }

  render() {
    return (
      <Styles>
        <Jumbo fluid className="jumbo">
          <div className="overlay"></div>
          <Container>
            <h1>{this.state.jumbo.title}</h1>
            <p>{this.state.jumbo.content}</p>
          </Container>
        </Jumbo>
      </Styles>
    );
  }
}

export default Jumbotron;
