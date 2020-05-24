import React from 'react';
import { Form, FormControl, Row, Col, InputGroup, Button, ListGroup } from 'react-bootstrap';
import _ from 'lodash';
import axios from 'axios';
import '../../styles/staff-profile.css';
import { PubCardSettings } from '../../components/PubCardSettings';
import { NewsCardSettings } from '../../components/NewsCardSettings';
import * as Utils from '../../utils/Utils';
import bsCustomFileInput from 'bs-custom-file-input';

class StaffProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      profileType: "",
      facultyType: "",
      oldProfile: {
        url: "",
        profileType: ""
      },
      searchName: "",
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
      generalProfile: {
        intro: "",
        sidebar: "",
        imgUrl: "",
        isPicValid: false,
        picUploadMsg: ""
      },
      newsCards: [],
      pubCards: [],
      isUpdated: true
    };
  }

  componentDidMount() {
    // alert before leaving if updates are not saved
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

  /**
   * handle faculty type choosing with radio buttons,
   * clear the old chosen faculty,
   * clear search results
   */
  handleFacultyTypeChange = (event) => {
    const {value} = event.target;
    this.setState({
      facultyType: value,
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
      profileType: "",
      settingDetail: []
    }, () => {
      this.getFacultyByType(value);
      this.handleCancelSearch();
    });
  }

  /**
   * get the faculty from backend 
   * after a type is chosen
   * @param {String} type
   */
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

  /**
   * handle the search to backend 
   * after the search button is clicked
   */
  handleGoSearch = async () => {
    console.log("doing search in backend");
    console.log("name: " + this.state.searchName + " type: " + this.state.facultyType);

    let res = {};
    const url = process.env.REACT_APP_FACULTY_URL + "/searchFacultyByNameWithType";
    
    // send search request
    await axios.get(url, {
      params: {
        name: this.state.searchName,
        type: this.state.facultyType
      }
    })
    .then((getRes) => {
      res = getRes;
    })
    .catch((err) => {
      console.log(err);
      return -1;
    });

    // load search result to list
    if (res.status === 200 && res.data.code === 0) {
      this.setState({
        facultyList: res.data.data
      }, () => {
        this.renderFacultyListElement(_.cloneDeep(this.state.facultyList));
      });
    }
  }

  handleCancelSearch = () => {
    this.setState({
      searchName: ""
    }, () => {
      this.getFacultyByType(this.state.facultyType);
    });
  }

  /**
   * load faculty info after clicked
   * @param {Object} faculty the faculty to be loaded
   * @param {Integer} index the index in the faculty list
   */
  handleFacultyClick = (faculty, index) => (event) => {
    // trim the faculty url if it is personal url
    let facultyUrl = faculty.url;
    if (facultyUrl.includes("https://")) {
      facultyUrl = facultyUrl.substring(8);
    }

    const facultyObj = {
      ...faculty,
      url: facultyUrl,
      isUpdated: true,
      listIndex: index
    };

    // not allow to jump to other faculties
    // unless changes are updated
    const oldName = this.state.chosenFaculty.name
    if (!this.state.isUpdated) {
      alert(`profile of ${oldName} has not been updated!`);
      return -1;
    }

    // decide whether faculty detail page used url or template
    // based on the type of faculty url
    let oldProfileType = "";
    if (faculty.url === "/people/~" + faculty.username) {
      oldProfileType = "template";
    } else if (faculty.url !== "") {
      oldProfileType = "url";
    }

    // after clicked the setting part will be re-rendered
    // to get correct faculty information
    this.setState({
      chosenFaculty: facultyObj,
      profileType: oldProfileType
    }, () => {
      this.renderFacultyListElement(_.cloneDeep(this.state.facultyList));
      this.getGeneralProfile(this.state.chosenFaculty.username);
      this.getNewsCards();
      this.getPubCards();
    });
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
      // exist profile before
      if (res.data.data) {
        let retGeneralProfile = res.data.data[0];
        
        // check profile photo validity
        if (retGeneralProfile.imgUrl !== "") {
          retGeneralProfile.isPicValid = true;
        }

        this.setState({
          generalProfile: retGeneralProfile
        });
      } else {
        const tempGeneralProfile = {
          intro: "<p>sample intro code</p>",
          sidebar: "<p>sample sidebar code</p>",
          imgUrl: "",
          isPicValid: false,
          picUploadMsg: ""
        };

        this.setState({
          generalProfile: tempGeneralProfile
        });
      }
    }
  }

  getNewsCards = async () => {
    const url = process.env.REACT_APP_FACULTY_URL +
    "/getProfileCustom?username=" + this.state.chosenFaculty.username;
  
    const res = await axios.get(url)
      .catch((err) => {
        console.log(err);
        return -1;
      });

    if (res.status === 200 && res.data.code === 0) {
      if (res.data.data.length >= 1) {
        let retNewsCards = res.data.data;
        retNewsCards.forEach(card => {
          card.changed = false;
        });

        this.setState({
          newsCards: retNewsCards
        });
      } else {
        this.setState({
          newsCards: [{
            id: 0,
            dateBar: Utils.getCurrentDate("."),
            codeSegment: "<p>html code segment</p>",
            type: "news",
            deprecated: 0,
            changed: true
          }]
        });
      }
    }
  }

  getPubCards = async () => {
    const url = process.env.REACT_APP_FACULTY_URL +
    "/getProfileCard?username=" + this.state.chosenFaculty.username;
  
    const res = await axios.get(url)
      .catch((err) => {
        console.log(err);
        return -1;
      });

    if (res.status === 200 && res.data.code === 0) {
      if (res.data.data.length >= 1) {
        let retPubCards = res.data.data;
        retPubCards.forEach(card => {
          card.changed = false;
          card.isPicValid = card.imgUrl !== "";
          card.picUploadMsg = "";
        });

        this.setState({
          pubCards: retPubCards
        });
      } else {
        this.setState({
          pubCards: [{
            id: 0,
            title: "sample title",
            text: "sample content text",
            url: "https://sample.url",
            imgName: "",
            imgUrl: "",
            isPicValid: false,
            uploadMsg: "",
            type: "publication",
            deprecated: 0,
            changed: true
          }]
        });
      }
    }
  }

  /** handle profile type choosing radio buttons */ 
  handleProfileTypeChange = (event) => {
    const {value} = event.target;

    // change the faculty url to template-specific url
    if (value === "template") {
      this.setState(prevState => {
        const newUrl = "/people/~" + 
          prevState.chosenFaculty.username;

        return {
          ...prevState,
          chosenFaculty: {
            ...prevState.chosenFaculty,
            url: newUrl
          },
          profileType: value,
          isUpdated: false
        };
      })
    } else {
      this.setState({
        profileType: value,
        isUpdated: false
      });
    }
  }

  handleRemoveProfile = () => {
    // remove the profile
    if (this.state.chosenFaculty.url !== "") {
      this.setState(prevState => {
        return {
          ...prevState,
          oldProfile: {
            profileType: prevState.profileType,
            url: prevState.chosenFaculty.url
          },
          profileType: "",
          chosenFaculty: {
            ...prevState.chosenFaculty,
            url: ""
          },
          isUpdated: false
        };
      });
    } else {
    // restore the profile
      this.setState(prevState => {
        return {
          ...prevState,
          profileType: prevState.oldProfile.profileType,
          chosenFaculty: {
            ...prevState.chosenFaculty,
            url: prevState.oldProfile.url
          },
          isUpdated: false
        };
      });
    }
  }

  /** currently handle the url change */ 
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
    });
  }

  handlePicChange = async (event) => {
    console.log("handling profile pic change");
    // prevent default behavior
    // initialize url, file and file data
    event.preventDefault();
    const url = process.env.REACT_APP_FACULTY_URL + "/uploadProfileImg";
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    const res = await axios.post(url, formData, {
      headers: {'Content-type': 'multipart/form-data'}
    })
    .catch(err => {
      console.log(err);
      return -1;
    });

    if (res.status === 200 && res.data.code === 0) {
      this.setState(prevState => {
        return {
          ...prevState,
          generalProfile: {
            ...prevState.generalProfile,
            imgUrl: res.data.data,
            isPicValid: true,
            picUploadMsg: "update photo success"
          },
          isUpdated: false
        };
      });
    } else {
      this.setState(prevState => {
        return {
          ...prevState,
          generalProfile: {
            ...prevState.generalProfile,
            imgUrl: "",
            isPicValid: false,
            picUploadMsg: ""
          },
          isUpdated: false
        };
      });
    }
  }

  handleProfileDetailChange = (event) => {
    const {name, value} = event.target;

    this.setState(prevState => {
      return {
        ...prevState,
        generalProfile: {
          ...prevState.generalProfile,
          [name]: value
        },
        isUpdated: false
      };
    });
  }

  handleCardChange = (cardIndex, type) => (event) => {
    const {name, value} = event.target;
    const cardsName = `${type}Cards`;

    let newCards = _.cloneDeep(this.state[cardsName]);
    newCards[cardIndex][name] = value;
    newCards[cardIndex].changed = true;

    this.setState({
      [cardsName]: _.cloneDeep(newCards),
      isUpdated: false
    });
  }

  handleCardPicChange = (cardIndex, type) => async (event) => {
    console.log("handling card pic change");
    // prevent default behavior
    // initialize url, file and file data
    event.preventDefault();
    const url = process.env.REACT_APP_FACULTY_URL + "/uploadProfileImg";
    const fileName = event.target.files[0].name
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    const res = await axios.post(url, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
      })
      .catch(err => {
        console.log(err);
        return -1;
      });
    
    const cardsName = `${type}Cards`;
    if (res.status === 200 && res.data.code === 0) {
      let newCards = _.cloneDeep(this.state[cardsName]);
      newCards[cardIndex].isPicValid = true;
      newCards[cardIndex].imgUrl = res.data.data;
      newCards[cardIndex].imgName = fileName;
      newCards[cardIndex].picUploadMsg = "picture upload success!";
      newCards[cardIndex].changed = true;

      this.setState({
        [cardsName]: newCards,
        isUpdated: false
      });
      console.log(fileName+url);
    } else {
      let newCards = _.cloneDeep(this.state[cardsName]);
      newCards[cardIndex].isPicValid = false;
      newCards[cardIndex].changed = true;

      this.setState({
        [cardsName]: newCards,
        isUpdated: false
      });
    }
  }

  handleAddCard = (event) => {
    const {name} = event.target;
    const cardsName = `${name}Cards`;

    let newCards = _.cloneDeep(this.state[cardsName]);
    let cardTemp = {};

    if (name === "news") {
      cardTemp = {
        id: 0,
        dateBar: Utils.getCurrentDate("."),
        codeSegment: "<p>html code segment</p>",
        type: "news",
        deprecated: 0,
        changed: true
      }
    } else if (name === "pub") {
      cardTemp = {
        id: 0,
        title: "sample title",
        text: "sample content text",
        url: "https://sample.url",
        imgName: "",
        imgUrl: "",
        isPicValid: false,
        uploadMsg: "",
        type: "publication",
        deprecated: 0,
        changed: true
      }
    }
    
    newCards.push(cardTemp);

    this.setState({
      [cardsName]: _.cloneDeep(newCards),
      isUpdated: false
    });
  }

  handleRemove = (cardIndex, type) => (event) => {
    const cardsName = `${type}Cards`;

    let newCards = _.cloneDeep(this.state[cardsName]);
    newCards[cardIndex].deprecated = 
      newCards[cardIndex].deprecated === 0 ? 1 : 0;
    newCards[cardIndex].changed = true;

    this.setState({
      [cardsName]: _.cloneDeep(newCards),
      isUpdated: false
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.state.isUpdated) {
      console.log("no need to update");
      return 0;
    }

    await this.updateFacultyUrl();

    const profileUpdateRet = await this.updateGeneralProfile();

    if (profileUpdateRet === -1) {
      console.log("error happened when updating general profile");
      return profileUpdateRet;
    }

    await this.updateCards("news");

    const cardsUpdateRet = await this.updateCards("pub");

    if (cardsUpdateRet === -1) {
      console.log("error happened when updating publication cards");
      return cardsUpdateRet;
    }

    this.setState({
      isUpdated: true
    });
  }

  updateFacultyUrl = async () => {
    const url = process.env.REACT_APP_FACULTY_URL + "/updateFacultyUrl";

    // check url type
    let facultyUrl = this.state.chosenFaculty.url;
    if (this.state.profileType === "url") {
      facultyUrl = "https://" + facultyUrl;
    }
    
    const res = await axios.get(url, {
      params: {
        id: this.state.chosenFaculty.id,
        url: facultyUrl
      }
    })
    .catch((err) => {
      console.log(err);
      return -1;
    });

    if (res.status === 200 && res.data.code === 0) {
      console.log("url updated");
      // refresh the faculty list after update
      this.forceUpdate(() => {
        this.getFacultyByType(this.state.facultyType);
      });

      return 0;
    } else {
      return 1;
    }
  }

  updateGeneralProfile = async () => {
    const url = process.env.REACT_APP_FACULTY_URL + "/updateGeneralProfile";

    const profileImgUrl = this.state.generalProfile.imgUrl;
    
    const isProfileImgValid = this.state.generalProfile.isPicValid;

    if (profileImgUrl === "") {
      alert("Please upload profile photo!");
      return -1;
    }

    if (!isProfileImgValid) {
      alert("Profile photo is not valid!");
      return -1
    }
    
    const res = await axios.get(url, {
      params: {
        username: this.state.chosenFaculty.username,
        intro: this.state.generalProfile.intro,
        sidebar: this.state.generalProfile.sidebar,
        imgUrl: this.state.generalProfile.imgUrl
      }
    })
    .catch((err) => {
      console.log(err);
      return -1;
    });

    if (res.status === 200 && res.data.code === 0) {
      console.log("update general profile success");

      // refresh the faculty list after update
      this.forceUpdate(() => {
        this.getFacultyByType(this.state.facultyType);
      });

      return 0;
    } else {
      return 1;
    }
  }

  updateCards = async (type) => {
    let updateUrl = process.env.REACT_APP_FACULTY_URL + "/updateProfileCard";
    if (type === "news") {
      updateUrl = process.env.REACT_APP_FACULTY_URL + "/updateProfileCustom";
    }
    const cardsName = `${type}Cards`;

    for (const [index, card] of this.state[cardsName].entries()) {
      if (!card.changed) {
        continue;
      }

      if (type === "pub") {
        console.log("checking picture");
        // check empty picture
        if (card.imgUrl === "") {
          alert("please upload cover picture!");
          return -1;
        }

        // check picture validity
        if (!card.isPicValid) {
          alert("invalid card picture!");
          return -1;
        }
      }

      console.log("before update: ");
      console.log(card);
      const res = await axios.get(updateUrl, {
        params: {
          ...card,
          username: this.state.chosenFaculty.username
        }
      }).catch(err => {
        console.log(err);
        return -1;
      });

      if (res.status === 200 && res.data.code === 0) {
        if (res.data.data !== 0) {
          const retDatabaseId = res.data.data;
          let newCards = _.cloneDeep(this.state[cardsName]);

          newCards[index].id = retDatabaseId;
          this.setState({
            [cardsName]: newCards
          });
        }
      }
    }
  }

  /** render list elements according to returned faculty list */ 
  renderFacultyListElement = (facultyList) => {
    // render empty faculty array
    if (facultyList === undefined || facultyList.length === 0) {
      const facultyElement = [
        <ListGroup.Item variant="secondary" key={0}>
          No Result
        </ListGroup.Item>
      ];

      this.setState({
        facultyListElements: facultyElement
      });

      return -1;
    }

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

  /** sections listed from small to large */ 
  render() {
    // small dynamic parts
    const updateSuccess = <span style={{color: "green"}}>all contents are up-to-date</span>;
    const urlText = this.state.profileType === "template" ?
      "https://site-address" : "https://";

    let profileImgLink = null;
    let imgName = null;
    if (this.state.generalProfile.imgUrl !== "") {
      const visitUrl = this.state.generalProfile.imgUrl;
      const url = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
        + "visitUrl=" + encodeURIComponent(visitUrl);
      
      profileImgLink = 
        <a href={url} style={{color: "gray", fontSize: "smaller"}} download>
          [download profile photo]
        </a>;
      
      imgName = visitUrl.substring(visitUrl.lastIndexOf("/") + 1);
    }

    // faculty list search bar
    // will not appear unless faculty type is chosen
    const searchBar = this.state.facultyType !== "" ?
      <Form inline>
        <FormControl 
          type="text" 
          placeholder="Enter name to search"
          value={this.state.searchName} 
          className="mr-sm-2" 
          onChange={(event) => {this.setState({searchName: event.target.value})}}
        />
        <Button 
          variant="outline-success" 
          size="sm" 
          onClick={this.handleGoSearch} 
          style={{marginTop: "10px", marginRight: "10px"}}
        >
          Search
        </Button>
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={this.handleCancelSearch} 
          style={{marginTop: "10px"}}
        >
          Cancel
        </Button>
      </Form> : null;

    const personalUrl = this.state.profileType !== "" ?
    <Form.Group>
    <Form.Label>Personal URL</Form.Label>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text id="inputGroupPrepend">{urlText}</InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control 
        name="url"
        value={this.state.chosenFaculty.url}
        placeholder="personal website url"
        onChange={this.handleFacultyInfoChange}
        disabled={this.state.profileType === "template"}
      />
    </InputGroup>
  </Form.Group> : null;

    // template setting section
    // will not show if personal url is chosen
    const templateDetail = this.state.profileType === "template" ?
    <React.Fragment>
      <h5>Page Template</h5>

      <Form.Group>
        <Form.Label>Upload Profile Photo</Form.Label>
        <Form.File 
          id="custom-profile-photo"
          custom
        > 
          <Form.File.Input 
            isValid={this.state.generalProfile.isPicValid}
            isInvalid={!this.state.generalProfile.isPicValid} 
            onChange={this.handlePicChange}
          />
          <Form.File.Label>{imgName ? imgName : "upload photo here"}</Form.File.Label>
          <Form.Control.Feedback type="valid">
            {this.state.generalProfile.picUploadMsg}
          </Form.Control.Feedback>
          <Form.Control.Feedback type="invalid" style={{color: "red"}}>
            invalid picture type!
          </Form.Control.Feedback>
        </Form.File>
        {profileImgLink}
      </Form.Group>

      <Form.Group>
        <Form.Label>Brief Introduction (HTML code segment):</Form.Label>
        <Form.Control 
          name="intro"
          as="textarea"
          value={this.state.generalProfile.intro}
          onChange={this.handleProfileDetailChange}
          style={{height: "130px"}}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Contact and Other Sidebar Information (HTML code segment):</Form.Label>
        <Form.Control 
          name="sidebar"
          as="textarea"
          value={this.state.generalProfile.sidebar}
          onChange={this.handleProfileDetailChange}
          style={{height: "130px"}}
        />
      </Form.Group>
      <hr />

      <Form.Label><b>News</b> Card Settings:</Form.Label>
      <NewsCardSettings 
        cards={this.state.newsCards}
        handleCardChange={this.handleCardChange}
        handleRemove={this.handleRemove}
        handleAddCard={this.handleAddCard}
      />
      <hr />

      <Form.Label><b>Publication</b> Card Settings:</Form.Label>
      <PubCardSettings
        cards={this.state.pubCards}
        handleCardChange={this.handleCardChange} 
        handleCardPicChange={this.handleCardPicChange}
        handleRemove={this.handleRemove}
        handleAddCard={this.handleAddCard}
      />
    </React.Fragment> : null;

    // main setting page
    // will not show until a faculty is chosen
    const mainSettingDetail = this.state.chosenFaculty.listIndex !== -1 ? 
    <React.Fragment>
      <h5>Choose a Way to Provide Profile</h5>
      <div onChange={this.handleProfileTypeChange}>
        <input type="radio" name="url" value="url" checked={this.state.profileType === "url"} onChange={() => {}}/>
        <label htmlFor="url" style={{paddingLeft: "5px"}}>use personal url</label>
        <br />
        <input type="radio" name="template" value="template" checked={this.state.profileType === "template"} onChange={() => {}}/>
        <label htmlFor="template" style={{paddingLeft: "5px"}}>use provided template</label>
      </div>
      
      <div>
        <Button
          variant={this.state.chosenFaculty.url === "" ? "outline-danger" : "danger"} 
          size="sm"
          onClick={this.handleRemoveProfile}
        >
          {this.state.chosenFaculty.url === "" ? "Cancel" : "Remove Profile"}
        </Button>
        <Form.Text style={{color: "red", marginLeft: "2px"}}>
          WARNING: the whole profile will be removed after update!
        </Form.Text>
      </div>
      <hr />

      <h5>Profile Detail</h5>
      <Form onSubmit={this.handleSubmit}>
        {personalUrl}
        <br />

        {templateDetail}
        <hr />
        <Button variant="primary" type="submit">
          Update
        </Button>
        <Form.Text className="text-muted">
          {this.state.isUpdated ? updateSuccess : "changes have not been updated"}
        </Form.Text>
      </Form>
    </React.Fragment> : null;

    // initialize dynamic picture upload module
    bsCustomFileInput.init();

    return (
      <React.Fragment>
        <Row>
          <Col sm={3} style={{backgroundColor: "rgb(219, 215, 210)"}}>
            <h4 style={{marginTop: "10px"}}>Select a Faculty to Edit</h4>
            <a style={{color: "gray"}} href="/admin/main">{"<<"} return to main setting page</a>
            <hr />
            <h5>Faculty Type</h5>
            <div onChange={this.handleFacultyTypeChange}>
              <input type="radio" name="regular" value="regular" checked={this.state.facultyType === "regular"} onChange={() => {}}/>
              <label htmlFor="regular" style={{paddingLeft: "5px"}}>regular faculty</label>
              <br />
              <input type="radio" name="research" value="research" checked={this.state.facultyType === "research"} onChange={() => {}}/>
              <label htmlFor="url" style={{paddingLeft: "5px"}}>research staff</label>
              <br />
              <input type="radio" name="admin" value="admin" checked={this.state.facultyType === "admin"} onChange={() => {}}/>
              <label htmlFor="admin" style={{paddingLeft: "5px"}}>admin staff</label>
            </div>
            <hr />

            <h5>Faculty List</h5>
            {searchBar}
            <ListGroup className="profile-list-group">
              {this.state.facultyListElements}
            </ListGroup>
          </Col>

          <Col sm={8} style={{paddingLeft: "30px", paddingTop: "10px"}}>
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