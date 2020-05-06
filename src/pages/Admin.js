import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
      headline: {
        id: 0,
        title: "",
        content: "",
        url: "",
        deprecated: 0
      },
      jumbo: {
        id: 0,
        title: "",
        content: "",
        url: "",
        deprecated: 0
      },
      sidebar: {
        id: 0,
        title: "",
        content: "",
        url: "",
        deprecated: 0
      },
      cards: [],
      cardsReactElement: [],
      isUpdated: true,
      updating: false
    };
  }

  componentDidMount() {
    this.getTextBlocksByType("headline");
    this.getTextBlocksByType("jumbo");
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

        this.setState({
          [type]: resData
        });

        // console.log(this.state[type]);
      } else {
        this.getCardTextBlocks(res.data.data, type);
      }
    }
  }

  getCardTextBlocks = (resData, type) => {
    let cardArray = [];

    resData.forEach((item) => {
      let cardTemp = {};

      cardTemp.title = item.title;
      cardTemp.textList = item.content.split("[SEP]").filter(item => item);
      cardTemp.url = item.url;

      cardArray.push(cardTemp);
    });

    this.setState({
      cards: _.cloneDeep(cardArray)
    });

    this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
  }

  modifyCardToReactElement = (reactCardArray) => {
    // console.log("before changes: ");
    // console.log(this.state.cards);

    reactCardArray.forEach((card, cardIndex) => {
      card.textList = card.textList.map((text, textIndex) => {
        return (
          <Form.Group key={textIndex}>
            <Form.Label>Card Text {textIndex+1}</Form.Label>
            <Form.Control 
                  name="textList"
                  key={textIndex} 
                  value={this.state.cards[cardIndex].textList[textIndex]} 
                  onChange={this.handleCardChange(cardIndex, textIndex)}
            />
          </Form.Group>
        );
      });
    });

    reactCardArray = reactCardArray.map((item, cardIndex) => 
      <Form.Group key={cardIndex} controlId={cardIndex}>
        <h5 style={{fontSize: "16px"}}>Card {cardIndex+1}</h5>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control 
            name="title"
            value={this.state.cards[cardIndex].title} 
            onChange={this.handleCardChange(cardIndex)}
          />
        </Form.Group>

        {item.textList}

        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control 
            name="url"
            value={this.state.cards[cardIndex].url} 
            onChange={this.handleCardChange(cardIndex)}
          />
        </Form.Group>
      </Form.Group>
    );

    // console.log("after 2 changes: ");
    // console.log(this.state.cards);

    this.setState({
      cardsReactElement: reactCardArray
    });

    return _.cloneDeep(reactCardArray);
  }



  handleStaticChange = (event) => {
    const {name, id, value} = event.target;
    this.setState((prevState) => {
      return {
        isUpdated: false,
        [name]: {
          ...prevState[name],
          [id]: value
        }
      };
    });
  }

  handleCardChange = (cardIndex, textIndex) => (event) => {
    const {name, value} = event.target;
    let newCards = _.cloneDeep(this.state.cards);

    if (name === "textList") {
      newCards[cardIndex][name][textIndex] = value;
    } else {
      newCards[cardIndex][name] = value;
    }

    this.setState(
      {cards: _.cloneDeep(newCards)},
      () => {
        this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
      }
    );
  }
  
  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state);
    const url = process.env.REACT_APP_ADMIN_URL + "/updateHomeTextBlock";
    
    if (!this.state.isUpdated) {
      this.setState({
        updating: true
      })
      console.log("updating information...");

      await axios.get(url, {
        params: {
          id: this.state.headline.id,
          title: this.state.headline.title
        }
      });

      await axios.get(url, {
        params: {
          id: this.state.jumbo.id,
          title: this.state.jumbo.title,
          content: this.state.jumbo.content
        }
      });

      await axios.get(url, {
        params: {
          id: this.state.sidebar.id,
          content: this.state.sidebar.content
        }
      });

      this.setState({isUpdated: true});
      console.log("information updated");
      this.setState({
        updating: false
      })
    } else {
      console.log("no need to update");
    }
  }


  render() {
    const updateSuccess = <span style={{color: "green"}}>all contents are up-to-date</span>
    console.log("rendering elements...");

    return (
      <React.Fragment>
        <h3>Settings</h3>
        <hr />
        <div style={{width: "70%"}}>
          <Form onSubmit={this.handleSubmit}>
            <h5>Headline Setting</h5>
            <Form.Group>
              <Form.Label>Headline Title</Form.Label>
              <Form.Control 
                name="headline"
                id="title" 
                value={this.state.headline.title} 
                onChange={this.handleStaticChange}
              />
            </Form.Group>
            <hr />

            <h5>Jumbotron Setting</h5>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control 
                name="jumbo"
                id="title" 
                value={this.state.jumbo.title} 
                onChange={this.handleStaticChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Subtitle</Form.Label>
              <Form.Control 
                name="jumbo"
                id="content" 
                value={this.state.jumbo.content} 
                onChange={this.handleStaticChange}
              />
            </Form.Group>
            <hr />

            <h5>Sidebar Information Setting</h5>
            <Form.Group>
              <Form.Label>html code segment:</Form.Label>
              <Form.Control
                style={{height: "300px"}}
                as="textarea" 
                name="sidebar"
                id="content" 
                value={this.state.sidebar.content} 
                onChange={this.handleStaticChange}
              />
              <Form.Text className="text-muted">
                the sidebar information should be written in html segment, which will later be put on the home page.
              </Form.Text>
            </Form.Group>
            <hr />

            <h5>Card Item Settings</h5>
            {this.state.cardsReactElement}
            <hr />
          
            <Button variant="primary" type="submit" disabled={this.state.updating}>
              Update
            </Button>
            <Form.Text className="text-muted">
              {this.state.isUpdated ? updateSuccess : "changes have not been updated"}
            </Form.Text>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;