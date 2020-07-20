import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Tabs, Tab, Form, Col, Button, InputGroup } from 'react-bootstrap';
import '../../styles/tabs.css';

/** setting page for navbar label pages */
class AdminLabels extends React.Component {
  constructor() {
    super();
    this.state = {
      about: [],
      academics: [],
      admissions: [],
      aboutTabs: [],
      academicsTabs: [],
      admissionsTabs: [],
      aboutLen: 0,
      academicsLen: 0,
      admissionsLen: 0,
      isUpdated: true
    };
  }

  componentDidMount() {
    this.getLabelByType("about");
    this.getLabelByType("academics");
    this.getLabelByType("admissions");

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

  /**
   * function to check whether progress 
   * has been updated
   */
  beforeunload = (e) => {
    if (!this.state.isUpdated) {
      e.preventDefault();
      e.returnValue = true;
    }
  }

  getLabelByType = async (type) => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getLabels?labelType=" + type;
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
      });

    if (res.status === 200 && res.data.code === 0) {
      let labelsRes = res.data.data;
      labelsRes.forEach(label => {
        label.isUpdated = true;
        label.updating = false;
        label.url = label.url.slice(8);
      })

      // labels raw data initialization
      // and update old length accordingly
      this.setState((prevState) => {
        return {
          ...prevState,
          [type]: labelsRes,
          [`${type}Len`]: labelsRes.length
        };
      });
      
      // modify the labels to react elements
      this.modifyLabelsToReactElement(_.cloneDeep(this.state[type]), type);
    } else {
      console.log(`get ${type} labels failed!`);
    }
  }

  handleLabelChange = (type, labelIndex) => (event) => {
    const {name, value} = event.target;
    console.log(`label tab ${type} ${labelIndex} is changing...`);

    let newLabels = _.cloneDeep(this.state[type]);
    newLabels[labelIndex][name] = value;
    newLabels[labelIndex].isUpdated = false;

    this.setState({
      [type]: _.cloneDeep(newLabels),
      isUpdated: false
    }, () => {
      this.modifyLabelsToReactElement(_.cloneDeep(this.state[type]), type);
    });
  }

  handleRemove = (type, index) => (event) => {
    console.log(`label tab ${type} ${index} will be deprecated`);

    let newLabels = _.cloneDeep(this.state[type]);
    if (newLabels[index].deprecated === 1) {
      newLabels[index].deprecated = 0;
      newLabels[index].isUpdated = false;
    } else {
      newLabels[index].deprecated = 1;
      newLabels[index].isUpdated = false;
    }

    this.setState({
      [type]: _.cloneDeep(newLabels)
    }, () => {
      this.modifyLabelsToReactElement(_.cloneDeep(this.state[type]), type);
    });
  }

  handleAddLabel = (event) => {
    const {name} = event.target;
    let newLabels = _.cloneDeep(this.state[name]);

    // create new label template
    const newLabel = {
      id: 0,
      label: "New Label",
      url: "/url",
      codeContent: "<p>html code segment goes here</p>",
      type: name,
      deprecated: 0,
      isUpdated: false,
      updating: false
    };

    // put new label in new array
    newLabels.push(newLabel);

    // change state and render new elements immediately
    this.setState({
      [name]: newLabels,
      isUpdated: false
    }, () => {
      this.modifyLabelsToReactElement(_.cloneDeep(this.state[name]), name);
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const {labelType, labelIndex} = event.target.dataset;
    console.log("state before update:");
    console.log(this.state[labelType][labelIndex]);

    if (!this.state[labelType][labelIndex].isUpdated) {
      this.setState({
        updating: true
      })
      console.log("updating information...");

      const labelToUpdate = this.state[labelType][labelIndex];
      let updateUrl;

      if (labelIndex < this.state[`${labelType}Len`]) {
        updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateLabel";

        await axios.get(updateUrl, {
          params: {
            id: labelToUpdate.id,
            label: labelToUpdate.label,
            codeContent: labelToUpdate.codeContent,
            url: "/details" + labelToUpdate.url,
            deprecated: labelToUpdate.deprecated,
            type: labelToUpdate.type
          }
        }).catch(err => {
          console.log(err);
        });
      } else {
        updateUrl = process.env.REACT_APP_ADMIN_URL + "/createNewLabel";

        const res = await axios.get(updateUrl, {
          params: {
            id: labelToUpdate.id,
            label: labelToUpdate.label,
            codeContent: labelToUpdate.codeContent,
            url: "/details" + labelToUpdate.url,
            deprecated: labelToUpdate.deprecated,
            type: labelToUpdate.type
          }
        }).catch(err => {
          console.log(err);
        });

        if (res.status === 200 && res.data.code === 0) {
          const retId = _.cloneDeep(res.data.data);
          let newLabels = this.state[labelType];
          
          newLabels[labelIndex].id = retId;

          this.setState({
            [labelType]: newLabels,
            [`${labelType}Len`]: labelIndex + 1
          });
        }

        console.log("new label created:");
        console.log(this.state[labelType[labelIndex]]);
      }

      console.log("information updated");
      let newLabels = this.state[labelType];
      newLabels[labelIndex].isUpdated = true;

      this.setState({
        [labelType]: newLabels,
        updating: false,
        isUpdated: true
      }, () => {
        this.modifyLabelsToReactElement(_.cloneDeep(this.state[labelType]), labelType)
      });

    } else {
      console.log("no need to update");
    }
  }

  modifyLabelsToReactElement = (rawLabels, type) => {
    const labelTab = rawLabels.map((item, index) => {
      const updateSuccess = <span style={{color: "green"}}>label <b>{item.label}</b> is up-to-date</span>;
      const notUpdated = this.state[type][index].deprecated === 1 ?
        <span style={{color: "red"}}>WARNING: the whole card will be removed after update!</span> :
        "changes have not been updated";

      return (
        <Tab key={index} eventKey={index} title={item.label} size="sm">
          <Form 
            style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px", maxWidth: "800px"}}
            onSubmit={this.handleSubmit}
            data-label-type={type}
            data-label-index={index}
          >
            <Form.Row>
              <Col sm={4}>
                <Form.Group>
                  <Form.Label>Label Name</Form.Label>
                  <Form.Control 
                    name="label"
                    value={item.label}
                    onChange={this.handleLabelChange(type, index)}
                    disabled={this.state[type][index].deprecated === 1}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>URL</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroupPrepend">site-address/details</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control 
                      name="url"
                      value={item.url}
                      onChange={this.handleLabelChange(type, index)}
                      disabled={this.state[type][index].deprecated === 1}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted" style={{marginLeft: "5px"}}>
                    this url will be under /details route
                  </Form.Text>
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Group>
              <Form.Label>Code Segment</Form.Label>
              <Form.Control
                style={{height: "300px"}}
                as="textarea" 
                name="codeContent" 
                value={item.codeContent} 
                onChange={this.handleLabelChange(type, index)}
                disabled={this.state[type][index].deprecated === 1}
                spellCheck="false"
              />
            </Form.Group>

            <Button variant="primary" type="submit" size="sm" disabled={this.state.updating}>
              Update
            </Button>
            <Button 
              variant={this.state[type][index].deprecated === 1 ? "outline-danger" : "danger"} 
              size="sm" 
              style={{marginLeft: "5px", marginRight: "5px"}}
              onClick={this.handleRemove(type, index)}
            >
              {this.state[type][index].deprecated === 1 ? "Cancel" : "Remove"}
            </Button>
            <Button variant="primary" size="sm" name={type} onClick={this.handleAddLabel}>
              Add Another Label
            </Button>
            <Form.Text className="text-muted" style={{marginLeft: "5px"}}>
              {this.state[type][index].isUpdated ? updateSuccess : notUpdated}
            </Form.Text>
          </Form>
        </Tab>
      );
    });

    const tabsName = type + "Tabs";
    const bigTabs = 
      <Tabs
        className="card-tabs" 
        defaultActiveKey={0} 
        id="uncontrolled-tab-example"
      >
        {labelTab}
      </Tabs>;

    this.setState({
      [tabsName]: bigTabs
    });
    
    return bigTabs;
  }

  render() {
    return (
      <React.Fragment>
        <h3>Label and Label Page Settings</h3>
        <a style={{color: "gray"}} href="/admin/main">{"<<"} return to main setting page</a>
        <hr />

        <h5>About Labels Setting</h5>
        {this.state.aboutTabs}
        <hr />

        <h5>Academic Labels Setting</h5>
        {this.state.academicsTabs}
        <hr />

        <h5>Admissions Labels Setting</h5>
        {this.state.admissionsTabs}
        <hr />
      </React.Fragment>
    );
  }
}

export default AdminLabels;