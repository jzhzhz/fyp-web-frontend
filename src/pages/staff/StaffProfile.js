import React from 'react';
import { Form } from 'react-bootstrap';

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