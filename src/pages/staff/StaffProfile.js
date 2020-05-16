import React from 'react';
import { Form, Col, InputGroup, Button, Tab } from 'react-bootstrap';
import _ from 'lodash';

class StaffProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      choice: "",
      settingDetail: [],
      url: "",
      pageDetail: {
        intro: "",
        contact: ""
      }
    };
  }

  handleChangeMethod = (event) => {
    const {value} = event.target;
    this.setState({
      choice: value
    }, () => {
      this.renderProfileSettingByType(value);
    });
  }

  renderProfileSettingByType = (type) => {
    if (type === "url") {
      const urlForm = 
      <Form>
        <Form.Group>
          <Form.Label>Personal URL</Form.Label>
          <Form.Control 
            name="url"
            value={this.state.url}
            placeholder="personal website url"
          />
        </Form.Group>
      </Form>
  
      this.setState({
        settingDetail: urlForm
      });

    } else if (type === "template") {
      const tempForm = 
      <Form>
        <h5>Page Template</h5>
        <Form.Group>
          <Form.Label>Brief Introduction</Form.Label>
          <Form.Control 
            name="intro"
            value={this.state.pageDetail.intro}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Contact and Other Information</Form.Label>
          <Form.Control 
            name="contact"
            value={this.state.pageDetail.contact}
          />
        </Form.Group>
      </Form>

      this.setState({
        settingDetail: tempForm
      });
    }

  }

  modifyCardToReactElement = (reactCardArray) => {
    reactCardArray.forEach((card, cardIndex) => {
      // transform the text list in each card into form elments
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
      // transform the whole card object into form elements
      return (
        // each card becomes a tab of form in tabs
        <Tab key={cardIndex} eventKey={cardIndex} title={item.title} size="sm">
        <Form.Group 
          key={cardIndex} 
          controlId={cardIndex} 
          style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px"}}
        >
          <Form.Row>
            <Col sm={4}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control 
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
                <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">htttps://site-address</InputGroup.Text>
                    </InputGroup.Prepend>
                <Form.Control 
                  name="url"
                  value={this.state.cards[cardIndex].url} 
                  onChange={this.handleCardChange(cardIndex)}
                  disabled={this.state.cards[cardIndex].deprecated === 1}
                />
                </InputGroup>
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
            <Form.Text style={{color: "red", marginLeft: "2px"}}>WARNING: the whole card will be removed after update!</Form.Text>
          </Form.Group>
        </Form.Group>
        </Tab>
      );
    });

    this.setState({
      cardsReactElement: reactCardArray
    });

    return _.cloneDeep(reactCardArray);
  }

  render() {
    return (
      <React.Fragment>
        <h3>Profile Setting</h3>
        <a style={{color: "gray"}} href="/admin/main">{"<<"} return to main setting page</a>
        <hr />
        <h5>Choose a Way to Provide Profile</h5>
        <div onChange={this.handleChangeMethod}>
          <input type="radio" name="url" value="url" checked={this.state.choice === "url"}/>
          <label htmlFor="url" style={{paddingLeft: "5px"}}>use personal url</label>
          <br />
          <input type="radio" name="template" value="template" checked={this.state.choice === "template"}/>
          <label htmlFor="template" style={{paddingLeft: "5px"}}>use provided template</label>
        </div>
        <hr />
        
        {this.state.settingDetail}
      </React.Fragment>
    );
  }
}

export default StaffProfile;