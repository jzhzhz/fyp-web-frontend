import React from 'react';
import { Form, FormControl, Row, Col, Button, ListGroup } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import '../../styles/staff-profile.css';

import _ from 'lodash';
import axios from 'axios';
import * as Utils from '../../utils/Utils';

import { ProfileSettingMain } from '../../components/ProfileSettingMain';

/** setting page for the profile of staff */
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
        imgName: "",
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

    // disable setState action when unmounting components
    this.setState = (state, callback)=>{
      return;
    };
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
   * clear search results, 
   * get faculty list from backend
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
   * @param {string} type
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

  /** handle the search to backend after the search button is clicked */
  handleGoSearch = async () => {
    // console.log("doing search in backend");
    // console.log("name: " + this.state.searchName + " type: " + this.state.facultyType);
    const url = process.env.REACT_APP_FACULTY_URL + "/searchFacultyByNameWithType";
    
    // send search request
    const res = await axios.get(url, {
      params: {
        name: this.state.searchName,
        type: this.state.facultyType
      }
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

  /** cancel search result */
  handleCancelSearch = () => {
    this.setState({
      searchName: ""
    }, () => {
      this.getFacultyByType(this.state.facultyType);
    });
  }

  /**
   * load faculty info after clicked
   * @param {object} faculty the faculty to be loaded
   * @param {number} index the index in the faculty list
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

  /** 
   * get the general information about a faculty
   * @param {string} username for ideatity recognition 
   */
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
        // create new template profile
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

  /** get cards information in news tab */
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
      } else { // create a template card if not exist
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

  /** get cards information in publication tab */
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
      } else { // create a template card if not exist
        this.setState({
          pubCards: [{
            id: 0,
            title: "sample title",
            subtitle: "sample subtitle",
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
    // get chosen value
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

  /**
   * make the profile deprecated as a removal
   * save a profile history in case of restore
   */
  handleRemoveProfile = () => {
    // remove the profile
    // store the removed profile as old profile
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
    } else { // restore the profile
      // check if there exists old profile
      if (this.state.oldProfile.url !== "") {
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
      } else {
        alert("no profile to restore!");
      }
    }
  }

  /** currently only handle the url change */ 
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

  /** send profile photo to backend */
  handleProfilePicChange = async (event) => {
    // console.log("handling profile pic change");
    // prevent default behavior
    // initialize url, file and file data
    event.preventDefault();
    const url = process.env.REACT_APP_FACULTY_URL + "/uploadProfileImg";
    const fileName = event.target.files[0].name
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    // send the picture
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
            imgName: fileName,
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

  /** handle the changes in general profile */
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

  /** 
   * handle the changes in card, according to
   * @param {number} cardIndex index in a card
   * @param {string} type type of card
   */
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

  /** currently only handle publication card picture upload */
  handleCardPicChange = (cardIndex, type) => async (event) => {
    console.log("handling card pic change");
    // prevent default behavior
    // initialize url, file and file data
    event.preventDefault();
    const url = process.env.REACT_APP_FACULTY_URL + "/uploadProfileImg";
    const fileName = event.target.files[0].name
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    // sending req to back-end
    const res = await axios.post(url, formData, {
      headers: {'Content-Type': 'multipart/form-data'}
      })
      .catch(err => {
        console.log(err);
        return -1;
      });
    
    // update information if img upload success
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

  /** handle card adding */
  handleAddCard = (event) => {
    // name is card type
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

  /**
   * remove the card by setting deprecated as 1, vice versa 
   * @param {number} cardIndex index in a card
   * @param {string} type type of card
   */
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

  /**
   * submit the whole profile (if template) by calling 
   * updateFacultyUrl(), updateGeneralProfile(), 
   * updateCards("news") and updateCards("pub"), 
   * also check the image validity in general profile 
   * and publication cards
   */
  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.state.isUpdated) {
      console.log("no need to update");
      return 0;
    }

    await this.updateFacultyUrl();

    // if the profile type is "template"
    // update corresponding details
    if (this.state.profileType === "template") {
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
      // console.log("url updated");
      // refresh the faculty list after update
      this.forceUpdate(() => {
        this.getFacultyByType(this.state.facultyType);
      });

      return 0;
    } else {
      return 1;
    }
  }

  /** update the general part of a faculty's profile */
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
        imgName: this.state.generalProfile.imgName,
        imgUrl: this.state.generalProfile.imgUrl
      }
    })
    .catch((err) => {
      console.log(err);
      return -1;
    });

    if (res.status === 200 && res.data.code === 0) {
      // console.log("update general profile success");

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

      if (type === "pub" && card.deprecated === 0) {
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

      // console.log("before update: ");
      // console.log(card);
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
          style={{width: "100%"}}
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
            <ProfileSettingMain 
              parentState={this.state}
              handleFacultyInfoChange={this.handleFacultyInfoChange}

              // profile related functions
              handleProfilePicChange={this.handleProfilePicChange}
              handleProfileTypeChange={this.handleProfileTypeChange}
              handleRemoveProfile={this.handleRemoveProfile}
              handleProfileDetailChange={this.handleProfileDetailChange}

              // card related functions
              handleCardChange={this.handleCardChange}
              handleCardPicChange={this.handleCardPicChange}
              handleRemove={this.handleRemove}
              handleAddCard={this.handleAddCard}

              handleSubmit={this.handleSubmit}
            />
          </Col>
        </Row>

      </React.Fragment>
    );
  }
}

export default StaffProfile;