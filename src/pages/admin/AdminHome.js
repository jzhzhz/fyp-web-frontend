import React from 'react';
import { Form, Button } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import axios from 'axios';
import _ from 'lodash';
import { getCurrentDate } from '../../utils/Utils';
import { EditorState, RichUtils, convertToRaw, convertFromHTML, ContentState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

// import components
import NewEditor from '../../components/NewEditor';
import { HomeEventsCardSettings as EventsSettings } from '../../components/HomeEventsCardSettings';
import { HomeCardSettings } from '../../components/HomeCardSettings';

/**
 * admin page for home page elements, including:
 * headline, sidebar, jumbotron text, cards
 */
class AdminHome extends React.Component {
  constructor(props) {
    super(props);
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
      editorState: EditorState.createEmpty(),
      cards: [],
      eventsCards: [],
      oldCardsLength: 0,
      isUpdated: true,
      updating: false,
    };
  }

  /**
   * retrive home page information 
   * when this admin page is first loaded,
   * add event listener for unsaved progress as well
   */
  componentDidMount() {
    this.getTextBlocksByType("headline");
    this.getTextBlocksByType("jumbo");
    this.getTextBlocksByType("sidebar");
    this.getCards();
    this.getEventsCards();

    // initialize file upload customization
    // to file name dynamically
    bsCustomFileInput.init();

    // alert before leaving if updates are not saved
    window.addEventListener('beforeunload', this.beforeunload);
  }

  /** remove the event listener when unmount this page */
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.beforeunload);

    // disable setState action when unmounting components
    this.setState = (state, callback)=>{
      return;
    };
  }

  /** function to check whether progress has been updated */
  beforeunload = (e) => {
    if (!this.state.isUpdated) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  onEditorChange = (newEditorState, firstAttempt = false) => {
    this.setState(prevState => {
      return {
        editorState: newEditorState,
        sidebar: {
          ...prevState.sidebar,
          content: stateToHTML(newEditorState.getCurrentContent()),
          changed: !firstAttempt
        },
        isUpdated: firstAttempt
      };
    });
  };

  draftHandleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onEditorChange(newState);
      return true;
    }
    return false;
  }

  draftToggleBlockType = (blockType) => {
    this.onEditorChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  draftToggleInlineStyle = (inlineStyle) => {
    this.onEditorChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  handleEditorSwitch = (event) => {
    event.preventDefault();

    // switch from rich text to raw editor
    if (this.state.sidebar.title === "editor") {
      this.setState(prevState => {
        return {
          sidebar: {
            ...prevState.sidebar,
            title: "raw",
            changed: true
          },
          isUpdated: false
        };
      });
    } else { // switch to rich editor
      const blocksFromHTML = convertFromHTML(this.state.sidebar.content);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );

      this.setState(prevState => {
        return {
          editorState: EditorState.createWithContent(state),
          sidebar: {
            ...prevState.sidebar,
            title: "editor",
            changed: true
          },
          isUpdated: false
        }
      });
    }
  }

  /**
   * get home page text blocks by type
   * @param {string} type
   */
  getTextBlocksByType = async (type) => {
    const url = process.env.REACT_APP_BACKEND_URL +
      "/getHomeTextBlockByType?type=" + type;

    const res = await axios.get(url)
      .catch((err) => {
        console.log(err);
        return -1;
      });

    // static text block assinment
    if (res.status === 200 && res.data.code === 0) {
      this.setState({
        [type]: res.data.data[0]
      }, () => {
        if (type === "sidebar") {
          const rawContentState = JSON.parse(decodeURIComponent(this.state.sidebar.url));
          const firstAttempt = true;

          this.onEditorChange(
            EditorState.createWithContent(convertFromRaw(rawContentState)),
            firstAttempt
          );
        }
      });

    } else { return -1; }

    return 0;
  }

  /** get home page cards information */
  getCards = async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/getAllCards";

    const res = await axios.get(url)
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

    return 0;
  }

  /** get home page events information */
  getEventsCards = async () => {
    const url = process.env.REACT_APP_BACKEND_URL +
      "/getAllEvents";

    const res = await axios.get(url)
      .catch((err) => {
        console.log(err);
        return -1;
      });

    if (res.status === 200 && res.data.code === 0) {
      res.data.data.forEach(card => {
        card.changed = false;
      });

      this.setState({
        eventsCards: res.data.data
      });
    }
  }

  /** static textblock change handler */
  handleStaticChange = (event) => {
    // name: the name of home textblock
    // id: the type of content in textblock
    // value: the content of a type in textblock
    const { name, id, value } = event.target;
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

  /**
   * card changes (except picture) handler
   * @param {int} cardIndex
   */
  handleCardChange = (cardIndex) => (event) => {
    // name: type of content in a card
    // value: content of that type in a card
    const { name, value } = event.target;
    let newCards = _.cloneDeep(this.state.cards);

    newCards[cardIndex][name] = value;
    newCards[cardIndex].changed = true;

    // re-render the elements after state update
    this.setState({
      cards: _.cloneDeep(newCards),
      isUpdated: false
    });
  }

  handleEventsCardChange = (cardIndex) => (event) => {
    // name: type of content in a card
    // value: content of that type in a card
    const { name, value } = event.target;
    let newEventsCards = this.state.eventsCards.slice();

    newEventsCards[cardIndex][name] = value;
    newEventsCards[cardIndex].changed = true;

    this.setState({
      eventsCards: newEventsCards.slice(),
      isUpdated: false
    });
  }

  /**
   * card picture changes handler and conduct the upload process
   * @param {int} cardIndex
   */
  handlePicChange = (cardIndex) => async (event) => {
    // prevent default behavior
    // initialize url, file and file data
    event.preventDefault();
    const url = process.env.REACT_APP_ADMIN_URL + "/uploadCardPic";
    const fileName = event.target.files[0].name
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    const res = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .catch(err => {
        console.log(err);
        return -1;
      });

    // handling response from backend
    if (res.status === 200 && res.data.code === 0) {
      // handling correct file response
      let newCards = _.cloneDeep(this.state.cards);

      // update card picture related info
      newCards[cardIndex].isPicValid = true;
      newCards[cardIndex].imgUrl = res.data.data;
      newCards[cardIndex].imgName = fileName;
      newCards[cardIndex].changed = true;
      newCards[cardIndex].uploadMsg = "picture upload success";
      console.log(newCards[cardIndex].imgName + newCards[cardIndex].imgUrl);

      this.setState({
        cards: newCards,
        isUpdated: false
      });

    } else {
      // handling wrong file response
      let newCards = _.cloneDeep(this.state.cards);
      newCards[cardIndex].isPicValid = false;
      newCards[cardIndex].changed = true;
      console.log(newCards[cardIndex].imgUrl);

      this.setState({
        cards: newCards,
        isUpdated: false
      });
    }
  }

  /**
   * adding new card button handler, 
   * new card template will be initialized
   */
  handleAddCard = () => {
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
    });
  }

  handleAddEventsCard = () => {
    console.log("adding event card")
    const newCard = {
      id: 0,
      title: "sample title",
      subtitle: getCurrentDate("."),
      content: "sample event content",
      url: "/url",
      deprecated: 0,
      changed: true
    };

    let newEventsCards = this.state.eventsCards.slice();
    newEventsCards.push(newCard);

    this.setState({
      eventsCards: newEventsCards.slice(),
      isUpdated: false
    });
  }

  /**
   * card remove button handler
   * @param {int} cardIndex
   */
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
    });
  }

  handleEventsCardRemove = (cardIndex) => (event) => {
    let newEventsCards = this.state.eventsCards.slice();

    newEventsCards[cardIndex].deprecated =
      newEventsCards[cardIndex].deprecated === 0 ? 1 : 0;
    newEventsCards[cardIndex].changed = true;

    this.setState({
      eventsCards: newEventsCards.slice(),
      isUpdated: false
    });
  }

  /**
   * submit button handler,
   * calling several update functions 
   * and handle the response
   */
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

      await this.updateEventsCards();

      const result = await this.updateCards();

      if (result === 0) {
        this.setState({ isUpdated: true });
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
      alert("no need to update");
    }
  }

  updateTextBlockByType = async (type) => {
    let updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateHomeTextBlock";

    if (this.state[type].changed) {
      // store the raw edit content state in the url part of sidebar
      if (type === "sidebar") {
        const contentStateStr = encodeURIComponent(
          JSON.stringify(
            convertToRaw(this.state.editorState.getCurrentContent())
          )
        );

        this.setState(prevState => {
          return {
            sidebar: {
              ...prevState.sidebar,
              url: contentStateStr
            }
          };
        });
      }

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

  /** update the cards information */
  updateCards = async () => {
    let updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateCardById";
    // iterate through each card, update old card, create new card
    for (const [index, card] of this.state.cards.entries()) {
      // check if the values have been changed
      if (!card.changed) {
        continue;
      }

      // check empty picture
      if (card.imgUrl === "") {
        alert("please upload cover picture!");
        return -1;
      }

      // check picture validity
      if (!card.isPicValid) {
        alert("invalid picture!");
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

  updateEventsCards = async () => {
    let updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateEventsCardById";
    // iterate through each card, update old card, create new card
    for (const [index, card] of this.state.eventsCards.entries()) {
      if (!card.changed) {
        continue;
      }

      const res = await axios.get(updateUrl, {
        params: card
      }).catch(err => {
        console.log(err);
        return -1;
      });

      // update success
      if (res.status === 200 && res.data.code === 0) {
        const retId = res.data.data;
        let newEventsCards = this.state.eventsCards.slice();

        // getting database id for new card
        if (retId !== 0) {
          newEventsCards[index].id = retId;
        }

        newEventsCards[index].changed = false;

        this.setState({
          eventsCards: newEventsCards
        });
      } else {
        console.log("error happened when updating events cards");
        return -1;
      }
    }
  }

  render() {
    const updateSuccess = <span style={{ color: "green" }}>all contents are up-to-date</span>

    return (
      <React.Fragment>
        <h3>Home Page Settings</h3>
        <a style={{ color: "gray" }} href="/admin/main">{"<<"} return to main setting page</a>
        <hr />
        <div style={{ width: "70%" }}>
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
              <Form.Label>Rich Text Editor:</Form.Label>
              <NewEditor
                htmlSegment={this.state.sidebar.content}
                editorState={this.state.editorState}
                handleKeyCommand={this.draftHandleKeyCommand}
                toggleBlockType={this.draftToggleBlockType}
                toggleInlineStyle={this.draftToggleInlineStyle}
                onChange={this.onEditorChange}
                disabled={this.state.sidebar.title !== "editor"}
              />
              <Form.Label style={{ marginTop: "5px" }}>Raw HTML:</Form.Label>
              <Form.Control
                style={{ height: "300px" }}
                as="textarea"
                name="sidebar"
                id="content"
                value={this.state.sidebar.content}
                onChange={this.handleStaticChange}
                disabled={this.state.sidebar.title === "editor"}
                spellCheck={false}
              />
              <Button
                size="sm"
                variant="warning"
                onClick={this.handleEditorSwitch}
                style={{ marginTop: "8px" }}
              >
                Switch Editor to: {this.state.sidebar.title === "editor" ?
                  "Raw HTML Editor" : "Rich Text Editor"
                }
              </Button>
              <Form.Text style={{ color: "#ffaa00", fontSize: "0.9em" }}>
                WARNING: some elements might be changed during editor transition
              </Form.Text>
            </Form.Group>
            <hr />

            <h5>Card Item Settings</h5>
            <Form.Label>
              even number of cards recommended
            </Form.Label>

            <HomeCardSettings
              cards={this.state.cards}
              handleCardChange={this.handleCardChange}
              handleCardRemove={this.handleRemove}
              handleAddCard={this.handleAddCard}
              handlePicChange={this.handlePicChange}
            />
            <hr />

            <h5>Events Item Settings</h5>
            <EventsSettings
              cards={this.state.eventsCards}
              handleEventsCardChange={this.handleEventsCardChange}
              handleEventsCardRemove={this.handleEventsCardRemove}
              handleAddEventsCard={this.handleAddEventsCard}
            />
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