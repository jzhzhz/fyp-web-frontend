import React from 'react';
import { Form, Button, Tabs, Tab, Col } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

class AdminHome extends React.Component {
  constructor() {
    super();
    this.state = {
      headline: {
        id: 0,
        title: "",
        content: "",
        url: "",
        deprecated: 0,
        changed: false
      },
      jumbo: {
        id: 0,
        title: "",
        content: "",
        url: "",
        deprecated: 0,
        changed: false
      },
      sidebar: {
        id: 0,
        title: "",
        content: "",
        url: "",
        deprecated: 0,
        changed: false
      },
      cards: [],
      cardsReactElement: [],
      oldCardsLength: 0,
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
        return -1;
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
    } else {
      return -1;
    }

    return 0;
  }

  getCardTextBlocks = (resData, type) => {
    let cardArray = [];

    resData.forEach((item) => {
      let cardTemp = {};

      cardTemp.id = item.id;
      cardTemp.title = item.title;
      cardTemp.textList = item.content.split("*SEP*").filter(item => item);
      cardTemp.url = item.url;
      cardTemp.changed = false;
      cardTemp.deprecated = 0;

      cardArray.push(cardTemp);
    });

    this.setState({
      cards: _.cloneDeep(cardArray),
      oldCardsLength: resData.length
    });

    this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
  }

  handleStaticChange = (event) => {
    const {name, id, value} = event.target;
    this.setState((prevState) => {
      return {
        isUpdated: false,
        [name]: {
          ...prevState[name],
          [id]: value,
          changed: true
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
    newCards[cardIndex].changed = true;

    this.setState(
      {
        cards: _.cloneDeep(newCards),
        isUpdated: false
      },
      () => {
        this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
      }
    );
  }

  handleAddCard = () => {
    console.log("adding another card");
    const newCard = {
      title: "Sample Title",
      textList: ["text1", "text2", "text3"],
      url: "/url",
      changed: true,
      deprecated: 0
    };

    let newCards = _.cloneDeep(this.state.cards);
    newCards.push(newCard);

    this.setState({
      cards: _.cloneDeep(newCards),
      isUpdated: false
    }, () => {
      this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
    });
  }

  handleRemove = (cardIndex) => (event) => {
    let newCards = _.cloneDeep(this.state.cards);
    if (newCards[cardIndex].deprecated === 1) {
      newCards[cardIndex].deprecated = 0;
    } else {
      newCards[cardIndex].deprecated = 1;
    }
    newCards[cardIndex].changed = true;

    this.setState(
      {
        cards: _.cloneDeep(newCards),
        isUpdated: false
      },
      () => {
        this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
      }
    );
  }
  
  handleSubmit = async (event) => {
    event.preventDefault();
    console.log("state before update:");
    console.log(this.state);

    if (!this.state.isUpdated) {
      this.setState({
        updating: true
      })
      console.log("updating information...");

      await this.updateTextBlockByType("headline");

      await this.updateTextBlockByType("jumbo");

      await this.updateTextBlockByType("sidebar");

      await this.updateTextBlockByType("cards");

      this.setState({isUpdated: true});
      console.log("information updated");
      this.setState({
        updating: false
      })
    } else {
      console.log("no need to update");
    }
  }

  updateTextBlockByType = async (type) => {
    let updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateHomeTextBlock";

    if (type === "cards") {
      for (const [index, card] of this.state.cards.entries()) {
        if (card.changed) {
          if (index+1 > this.state.oldCardsLength) {
            console.log("getting new cards...");
            updateUrl = process.env.REACT_APP_ADMIN_URL + "/createNewCard";
          }

          await axios.get(updateUrl, {
            params: {
              id: card.id,
              title: card.title,
              content: card.textList.join("*SEP*"),
              url: card.url,
              deprecated: card.deprecated
            }
          }).catch(err => {
            console.log(err);
            return -1;
          })
        }
      }
    } else {
      if (this.state[type].changed) {
        await axios.get(updateUrl, {
          params: {
            id: this.state[type].id,
            title: this.state[type].title,
            content: this.state[type].content,
            url: this.state[type].url,
            deprecated: this.state[type].deprecated
          }
        }).catch(err => {
          console.log(err)
          return -1;
        });
      }
    }

    return 0;
  }

  modifyCardToReactElement = (reactCardArray) => {
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
              disabled={this.state.cards[cardIndex].deprecated === 1}
            />
          </Form.Group>
        );
      });
    });

    reactCardArray = reactCardArray.map((item, cardIndex) => {
      return (
        <Form.Group key={cardIndex} controlId={cardIndex} style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px"}}>
          <h5 style={{fontSize: "16px"}}>Card "{this.state.cards[cardIndex].title}"</h5>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  style={{}} 
                  name="title"
                  value={this.state.cards[cardIndex].title} 
                  onChange={this.handleCardChange(cardIndex)}
                  disabled={this.state.cards[cardIndex].deprecated === 1}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control 
                  name="url"
                  value={this.state.cards[cardIndex].url} 
                  onChange={this.handleCardChange(cardIndex)}
                  disabled={this.state.cards[cardIndex].deprecated === 1}
                />
              </Form.Group>
            </Col>
          </Form.Row>

          {item.textList}

          <Form.Group>
            <Button 
              variant={this.state.cards[cardIndex].deprecated === 1 ? "outline-danger" : "danger"}
              size="sm"
              onClick={this.handleRemove(cardIndex)}
            >
              {this.state.cards[cardIndex].deprecated === 1 ? "Cancel" : "Remove"}
            </Button>
            <Form.Text style={{color: "red"}}>WARNING: the whole card will be removed after update!</Form.Text>
          </Form.Group>
        </Form.Group>
      );
    });

    this.setState({
      cardsReactElement: reactCardArray
    });

    return _.cloneDeep(reactCardArray);
  }

  render() {
    const updateSuccess = <span style={{color: "green"}}>all contents are up-to-date</span>

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
            <Tabs  defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="home" title="Home">
                <p>test1</p>
              </Tab>
              <Tab eventKey="profile" title="Profile">
                <p>test2</p>
              </Tab>
              <Tab eventKey="contact" title="Contact" disabled>
                <p>test3</p>
              </Tab>
            </Tabs>
            {this.state.cardsReactElement}
            <Button variant="primary" size="sm" onClick={this.handleAddCard}>
              Add another card
            </Button>
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

export default AdminHome;