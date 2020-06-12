import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

import { PubCardSettings } from '../components/PubCardSettings';
import { NewsCardSettings } from '../components/NewsCardSettings';

// main setting page
// will not show until a faculty is chosen
export const ProfileSettingMain = (props) => {
  // small dynamic parts
  const updateSuccess = <span style={{color: "green"}}>all contents are up-to-date</span>;
  const urlText = props.parentState.profileType === "template" ?
    "https://site-address" : "https://";

  // the download link and name if image
  // in general profile photo will be updated 
  // if the photo exists
  let profileImgLink = null;
  if (props.parentState.generalProfile.imgUrl !== "") {
    const visitUrl = props.parentState.generalProfile.imgUrl;
    const url = process.env.REACT_APP_BACKEND_URL + "/getCardImgByUrl?"
      + "visitUrl=" + encodeURIComponent(visitUrl);
    
    profileImgLink = 
      <a href={url} style={{color: "gray", fontSize: "smaller"}} download>
        [download profile photo]
      </a>;
  }

  // section to change personal url
  // will not pop up if there is no profile selected
  const personalUrl = props.parentState.profileType !== "" ?
  <Form.Group>
    <Form.Label>Personal URL</Form.Label>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text id="inputGroupPrepend">{urlText}</InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control 
        name="url"
        value={props.parentState.chosenFaculty.url}
        placeholder="personal website url"
        onChange={props.handleFacultyInfoChange}
        disabled={props.parentState.profileType === "template"}
      />
    </InputGroup>
  </Form.Group> : null;

    // template setting section
    // will not show if personal url is chosen
    const templateDetail = props.parentState.profileType === "template" ?
    <React.Fragment>
      <h5>Page Template</h5>

      <Form.Group>
        <Form.Label>Upload Profile Photo</Form.Label>
        <Form.File 
          id="custom-profile-photo"
          custom
        > 
          <Form.File.Input 
            isValid={props.parentState.generalProfile.isPicValid}
            isInvalid={!props.parentState.generalProfile.isPicValid} 
            onChange={props.handleProfilePicChange}
          />
          <Form.File.Label>
            {props.parentState.generalProfile.imgName ? 
              props.parentState.generalProfile.imgName : 
              "upload photo here"
            }
          </Form.File.Label>
          <Form.Control.Feedback type="valid">
            {props.parentState.generalProfile.picUploadMsg}
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
          value={props.parentState.generalProfile.intro}
          onChange={props.handleProfileDetailChange}
          style={{height: "130px"}}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Contact and Other Sidebar Information (HTML code segment):</Form.Label>
        <Form.Control 
          name="sidebar"
          as="textarea"
          value={props.parentState.generalProfile.sidebar}
          onChange={props.handleProfileDetailChange}
          style={{height: "130px"}}
        />
      </Form.Group>
      <hr />

      <Form.Label><b>News</b> Card Settings:</Form.Label>
      <NewsCardSettings 
        cards={props.parentState.newsCards}
        handleCardChange={props.handleCardChange}
        handleRemove={props.handleRemove}
        handleAddCard={props.handleAddCard}
      />
      <hr />

      <Form.Label><b>Publication</b> Card Settings:</Form.Label>
      <PubCardSettings
        cards={props.parentState.pubCards}
        handleCardChange={props.handleCardChange} 
        handleCardPicChange={props.handleCardPicChange}
        handleRemove={props.handleRemove}
        handleAddCard={props.handleAddCard}
      />
    </React.Fragment> : null;

  const mainSettingDetail = props.parentState.chosenFaculty.listIndex !== -1 ? 
  <React.Fragment>
    <h5>Choose a Way to Provide Profile</h5>
    <div className="profile-selection" onChange={props.handleProfileTypeChange}>
      <input type="radio" name="url" value="url" checked={props.parentState.profileType === "url"} onChange={() => {}}/>
      <label htmlFor="url" style={{paddingLeft: "5px"}}>use personal url</label>
      <br />
      <input type="radio" name="template" value="template" checked={props.parentState.profileType === "template"} onChange={() => {}}/>
      <label htmlFor="template" style={{paddingLeft: "5px"}}>use provided template</label>
    </div>
    
    <div className="profile-remove">
      <Button
        variant={props.parentState.chosenFaculty.url === "" ? "outline-danger" : "danger"} 
        size="sm"
        onClick={props.handleRemoveProfile}
      >
        {props.parentState.chosenFaculty.url === "" ? "Cancel" : "Remove Profile"}
      </Button>
      <Form.Text style={{color: "red", marginLeft: "2px"}}>
        WARNING: the whole profile will be removed after update!
      </Form.Text>
    </div>
    <hr />

    <h5>Profile Detail</h5>
    <Form onSubmit={props.handleSubmit}>
      {personalUrl}
      <br />

      {templateDetail}
      <hr />
      <Button variant="primary" type="submit">
        Update
      </Button>
      <Form.Text className="text-muted">
        {props.parentState.isUpdated ? updateSuccess : "changes have not been updated"}
      </Form.Text>
    </Form>
  </React.Fragment> : null;

  return (
    <React.Fragment>
      {mainSettingDetail}
    </React.Fragment>
  );
}