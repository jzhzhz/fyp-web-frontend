import React from 'react';
import { Form, Row, Col, InputGroup, Button, Tab, ListGroup } from 'react-bootstrap';
import _ from 'lodash';
import axios from 'axios';
import '../../styles/staff-profile.css';

class StaffProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      profileChoice: "",
      facultyChoice: "",
      facultyList: [],
      facultyListElements: [],
      chosenFaculty: {
        id: "",
        name: "",
        username: "",
        phone: "",
        office: "",
        email: "",
        url: "",
        listIndex: -1
      },
      settingDetail: [],
      url: "",
      pageDetail: {
        intro: "",
        contact: ""
      },
      isUpdated: true
    };
  }

  // handle faculty type choosing radio buttons
  // clear the old chosen faculty
  // clear the old choice and setting page
  handleFacultyTypeChange = (event) => {
    const {value} = event.target;
    this.setState({
      facultyChoice: value,
      chosenFaculty: {
        id: "",
        name: "",
        username: "",
        phone: "",
        office: "",
        email: "",
        url: "",
        listIndex: -1
      },
      profileChoice: "",
      settingDetail: []
    }, () => {
      this.getFacultyByType(value);
    });
  }

  // get faculty list after type is chosen
  getFacultyByType = async (type) => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getFacultyByType?type=" + type;
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
        return -1;
      });

    if (res.status === 200 && res.data.code === 0) {
      this.setState({
        facultyList: res.data.data
      }, () => {
        this.renderFacultyListElement(_.cloneDeep(this.state.facultyList));
      });
    }
  }

  // load faculty info after clicked
  handleFacultyClick = (faculty, index) => (event) => {
    const facultyObj = {
      ...faculty,
      isUpdated: true,
      listIndex: index
    }

    // allow to jump to other faculties
    // unless changes are updated
    const oldName = this.state.chosenFaculty.name
    if (!this.state.isUpdated) {
      alert(`profile of ${oldName} has not been updated!`);
      return -1;
    }

    // decide whether faculty detail page used url or template
    // based on the type of faculty url
    let oldProfileChoice = "";
    if (faculty.url === "/people/~" + faculty.username) {
      oldProfileChoice = "template";
    } else if (faculty.url !== "") {
      oldProfileChoice = "url";
    }

    // after clicked the setting part will be force-updated
    // to get correct faculty information
    this.setState({
      chosenFaculty: facultyObj,
      profileChoice: oldProfileChoice
    }, () => {
      this.forceUpdate(() => {
        this.renderProfileSettingByType(this.state.profileChoice);
        this.renderFacultyListElement(_.cloneDeep(this.state.facultyList));
      });
    });
  }

  // handle profile type choosing radio buttons
  handleProfileTypeChange = (event) => {
    const {value} = event.target;
    this.setState({
      profileChoice: value
    }, () => {
      this.renderProfileSettingByType(value);
    });
  }

  handleFacultyInfoChange = (event) => {
    const {name, value} = event.target;

    this.setState(prevState => {
      return {
        ...prevState,
        chosenFaculty: {
          ...prevState.chosenFaculty,
          [name]: value
        },
        isUpdated: false
      };
    }, () => {
      this.renderProfileSettingByType(this.state.profileChoice);
    });
  }

  handleProfileDetailChange = (event) => {

  }

  // render list elements according to returned faculty list
  renderFacultyListElement = (facultyList) => {
    let facultyElements = facultyList.map((faculty, index) => 
      <ListGroup.Item 
        as="button" 
        variant="secondary"
        key={faculty.id}
        onClick={this.handleFacultyClick(faculty, index)}
        style={
          this.state.chosenFaculty.id === faculty.id ? 
          {backgroundColor: "#6097c4"} : null
        } 
      >
        {faculty.name}
      </ListGroup.Item>
    );

    this.setState({
      facultyListElements: _.cloneDeep(facultyElements)
    });
  }

  // render profile setting according to returned profile type
  renderProfileSettingByType = (type) => {
    if (type === "template") {
      const tempForm = 
      <Form>
        <h5>Page Template</h5>
        <Form.Group>
          <Form.Label>Brief Introduction</Form.Label>
          <Form.Control 
            name="intro"
            value={this.state.pageDetail.intro}
            onChange={this.handleProfileDetailChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Contact and Other Information</Form.Label>
          <Form.Control 
            name="contact"
            value={this.state.pageDetail.contact}
            onChange={this.handleProfileDetailChange}
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
    const mainSettingDetail = this.state.chosenFaculty.listIndex !== -1 ? 
    <React.Fragment>
      <h5>Choose a Way to Provide Profile</h5>
      <div onChange={this.handleProfileTypeChange}>
        <input type="radio" name="url" value="url" checked={this.state.profileChoice === "url"} onChange={() => {}}/>
        <label htmlFor="url" style={{paddingLeft: "5px"}}>use personal url</label>
        <br />
        <input type="radio" name="template" value="template" checked={this.state.profileChoice === "template"} onChange={() => {}}/>
        <label htmlFor="template" style={{paddingLeft: "5px"}}>use provided template</label>
      </div>
      <hr />

      <Form>
        <Form.Group>
          <Form.Label>Personal URL</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">https://</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control 
              name="url"
              value={this.state.chosenFaculty.url}
              placeholder="personal website url"
              onChange={this.handleFacultyInfoChange}
              disabled={this.state.profileChoice === "template"}
            />
          </InputGroup>
        </Form.Group>
      </Form>
      
      {this.state.settingDetail}
    </React.Fragment> : null;

    return (
      <React.Fragment>
        <Row>
          <Col sm={3} style={{backgroundColor: "rgb(219, 215, 210)"}}>
            <h4 style={{marginTop: "10px"}}>Select a Faculty to Edit</h4>
            <a style={{color: "gray"}} href="/admin/main">{"<<"} return to main setting page</a>
            <hr />
            <h5>Faculty Type</h5>
            <div onChange={this.handleFacultyTypeChange}>
              <input type="radio" name="regular" value="regular" checked={this.state.facultyChoice === "regular"} onChange={() => {}}/>
              <label htmlFor="regular" style={{paddingLeft: "5px"}}>regular faculty</label>
              <br />
              <input type="radio" name="research" value="research" checked={this.state.facultyChoice === "research"} onChange={() => {}}/>
              <label htmlFor="url" style={{paddingLeft: "5px"}}>research staff</label>
              <br />
              <input type="radio" name="admin" value="admin" checked={this.state.facultyChoice === "admin"} onChange={() => {}}/>
              <label htmlFor="admin" style={{paddingLeft: "5px"}}>admin staff</label>
            </div>
            <hr />
            <h5>Faculty List</h5>
            <ListGroup className="profile-list-group">
              {this.state.facultyListElements}
            </ListGroup>
          </Col>

          <Col sm={8}>
            <h3>Profile Setting: <span style={{color: "gray"}}>{this.state.chosenFaculty.name}</span></h3>
            <hr />
            {mainSettingDetail}
          </Col>
        </Row>

      </React.Fragment>
    );
  }
}

export default StaffProfile;