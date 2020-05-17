import React from 'react';
import { Form, Button, Tabs, Tab, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';
import { getCurrentDate } from '../../utils/Utils';
import bsCustomFileInput from 'bs-custom-file-input';

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
      updating: false,
    };
  }

  componentDidMount() {
    this.getTextBlocksByType("headline");
    this.getTextBlocksByType("jumbo");
    this.getTextBlocksByType("sidebar");
    this.getCards();

    window.addEventListener('beforeunload', this.beforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload);
  }

  beforeunload = (e) => {
    if (!this.state.isUpdated) {
      e.preventDefault();
      e.returnValue = true;
    }
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

    // static text block assinment
    if (res.status === 200 && res.data.code === 0) {
      this.setState({
        [type]: res.data.data[0]
      });
    } else { return -1; }

    return 0;
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
    // initialize some picture upload related states
    // and set the old card list length
    if (res.status === 200 && res.data.code === 0) {
      let resData = res.data.data;

      resData.forEach(item => {
        item.changed = false;
        item.isPicValid = item.imgUrl !== "";
        item.picUploadMsg = "";
      });

      this.setState({
        cards: resData,
        oldCardsLength: resData.length
      });

    } else { return -1; }

    this.modifyCardToReactElement(_.cloneDeep(this.state.cards));

    return 0;
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

  handleCardChange = (cardIndex) => (event) => {
    const {name, value} = event.target;
    let newCards = _.cloneDeep(this.state.cards);

    newCards[cardIndex][name] = value;
    newCards[cardIndex].changed = true;

    this.setState({
        cards: _.cloneDeep(newCards),
        isUpdated: false
      }, () => {
        this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
      });
  }

  handlePicChange = (cardIndex) => async (event) => {
    event.preventDefault();
    const url = process.env.REACT_APP_ADMIN_URL + "/uploadCardPic";
    const fileName = event.target.files[0].name
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    const res = await axios.post(url, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
      })
      .catch(err => {
        console.log(err)
        return -1;
      });

    if (res.status === 200 && res.data.code === 0) {
      console.log("handling correct file");
      let newCards = _.cloneDeep(this.state.cards);

      newCards[cardIndex].isPicValid = true;
      newCards[cardIndex].imgUrl = res.data.data;
      newCards[cardIndex].imgName = fileName;
      newCards[cardIndex].changed = true;
      newCards[cardIndex].uploadMsg = "picture upload success";
      console.log(newCards[cardIndex].imgName + newCards[cardIndex].imgUrl);

      this.setState({
        cards: newCards,
        isUpdated: false
      }, () => {
        this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
      });

    } else {
      console.log("handling wrong file");
      let newCards = _.cloneDeep(this.state.cards);
      newCards[cardIndex].isPicValid = false;
      console.log(newCards[cardIndex].imgUrl);

      this.setState({
        cards: newCards
      }, () => {
        this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
      });
    }
  }

  handleAddCard = () => {
    console.log("adding another card");
    const newCard = {
      title: "Sample Title",
      text: "sample text",
      url: "/url",
      imgName: "",
      imgUrl: "",
      date: getCurrentDate("."),
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

    this.setState({
      cards: _.cloneDeep(newCards),
      isUpdated: false
    }, () => {
      this.modifyCardToReactElement(_.cloneDeep(this.state.cards));
    });
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

      const result = await this.updateCards();

      if (result === 0) {
        this.setState({isUpdated: true});
        console.log("information updated");

        this.setState({
          updating: false
        });
      } else if (result === -1) {
        console.log("card update failed");
        
        this.setState({
          updating: false
        });
      }

    } else {
      console.log("no need to update");
    }
  }

  updateTextBlockByType = async (type) => {
    let updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateHomeTextBlock";

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

    return 0;
  }

  updateCards = async (type) => {
    let updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateCardById";
      // iterate through each card, update old card, create new card
      for (const [index, card] of this.state.cards.entries()) {
        // check if the values have been changed
        if (!card.changed) {
          continue;
        }

        if (card.imgUrl === "") {
          alert("please upload cover picture!");
          return -1;
        }

        // check if this is a new card
        if (index + 1 > this.state.oldCardsLength) {
          console.log("getting new cards...");
          console.log(card);
          updateUrl = process.env.REACT_APP_ADMIN_URL + "/createNewCard";
          
          // insert new card into database
          let res = await axios.get(updateUrl, {
            params: card
          }).catch(err => {
            console.log(err);
            return -1;
          });
          
          // update the database id of newly created card
          if (res.status === 200 && res.data.code === 0) {
            const retId = res.data.data;
            let newCards = _.cloneDeep(this.state.cards);
            newCards[index].id = retId;

            this.setState({
              cards: _.cloneDeep(newCards)
            });
          }
        } else {
          // update values of other old cards
          await axios.get(updateUrl, {
            params: card
          }).catch(err => {
            console.log(err);
            return -1;
          });
        }
      }
      
      // update the old length of cards array
      const newLen = this.state.cards.length;
      this.setState({
        oldCardsLength: newLen
      });

      return 0;
  }

  // change the card information into form elements
  // and store the result in the state
  modifyCardToReactElement = (reactCardArray) => {
    reactCardArray = reactCardArray.map((item, cardIndex) => {
      if (item.id < 0) {
        return null;
      }
      
      // provide a picture download link
      let imgDownloadLink = null;
      if (item.imgUrl !== "") {
        const url = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
          + "visitUrl=" + encodeURIComponent(item.imgUrl);

        imgDownloadLink = 
          <a 
            href={url} 
            style={{color: "gray", fontSize: "smaller"}} 
            download
          >
            [download picture]
          </a>;
      }

      let imageUploadSection = 
        <div>
          <Form.Label>Image Upload Disabled</Form.Label>
        </div>;
      if (item.deprecated === 0) {
        imageUploadSection = 
          <div>
            <Form.Label>Upload The Cover Picture</Form.Label>
            <Form.File 
              id="custom-file"
              custom
            > 
              <Form.File.Input 
                isValid={this.state.cards[cardIndex].isPicValid}
                isInvalid={!this.state.cards[cardIndex].isPicValid} 
                onChange={this.handlePicChange(cardIndex)}
              />
              <Form.File.Label data-browse="Choose File">
                {this.state.cards[cardIndex].imgName}
              </Form.File.Label>
              <Form.Control.Feedback type="valid">
                {this.state.cards[cardIndex].uploadMsg}
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid" style={{color: "red"}}>
                invalid picture type!
              </Form.Control.Feedback>
            </Form.File>
            {imgDownloadLink}
          </div>;
      }

      // transform the whole card object into form elements
      return (
        // each card becomes a tab of form in tabs
        <Tab key={cardIndex} eventKey={cardIndex} title={`Card ${cardIndex+1}`} size="sm">
        <Form.Group 
          key={cardIndex} 
          controlId={cardIndex} 
          style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px"}}
        >
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control 
              name="title"
              value={this.state.cards[cardIndex].title} 
              onChange={this.handleCardChange(cardIndex)}
              disabled={this.state.cards[cardIndex].deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>URL</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">https://site-address</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control 
                name="url"
                value={this.state.cards[cardIndex].url} 
                onChange={this.handleCardChange(cardIndex)}
                disabled={this.state.cards[cardIndex].deprecated === 1}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            {imageUploadSection}
          </Form.Group>

          <Form.Group>
            <Form.Label>Date Footer</Form.Label>
            <Form.Control 
              name="date"
              value={this.state.cards[cardIndex].date} 
              onChange={this.handleCardChange(cardIndex)}
              disabled={this.state.cards[cardIndex].deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Card Text</Form.Label>
            <Form.Control
              style={{height: "90px"}} 
              name="text"
              as="textarea" 
              value={this.state.cards[cardIndex].text} 
              onChange={this.handleCardChange(cardIndex)}
              disabled={this.state.cards[cardIndex].deprecated === 1}
            />
          </Form.Group>

          <Form.Group>
            <Button 
              variant={this.state.cards[cardIndex].deprecated === 1 ? "outline-danger" : "danger"}
              size="sm"
              onClick={this.handleRemove(cardIndex)}
            >
              {this.state.cards[cardIndex].deprecated === 1 ? "Cancel" : "Remove"}
            </Button>
            <Form.Text style={{color: "red", marginLeft: "2px"}}>WARNING: the whole card will be removed after update!</Form.Text>
          </Form.Group>
        </Form.Group>
        </Tab>
      );
    });

    this.setState({
      cardsReactElement: reactCardArray
    });
    bsCustomFileInput.init();

    return _.cloneDeep(reactCardArray);
  }

  render() {
    const updateSuccess = <span style={{color: "green"}}>all contents are up-to-date</span>

    return (
      <React.Fragment>
        <h3>Home Page Settings</h3>
        <a style={{color: "gray"}} href="/admin/main">{"<<"} return to main setting page</a>
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
            <Form.Label>
                even number of cards recommended
            </Form.Label>
            <Tabs className="myClass" defaultActiveKey={0} id="uncontrolled-tab-example">
              {this.state.cardsReactElement}
            </Tabs>
            
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