import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Tabs, Tab, Form, Col, Button } from 'react-bootstrap';
import '../../styles/tabs.css';

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
    };
  }

  componentDidMount() {
    this.getLabelByType("about");
    this.getLabelByType("academics");
    this.getLabelByType("admissions");
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
      })

      // labels raw data initialization
      this.setState((prevState) => {
        return {
          ...prevState,
          [type]: labelsRes,
        };
      });
      
      console.log(`get ${type} labels success!`);
      console.log(this.state[type]);
      
      this.modifyLabelsToReactElement(_.cloneDeep(this.state[type]), type);
    } else {
      console.log(`get ${type} labels failed!`);
    }
  }

  handleLabelChange = (type, labelIndex) => (event) => {
    const {name, value} = event.target;
    console.log(`label tab ${type} is changing...`);
    console.log(this.state[type]);

    const newLabels = _.cloneDeep(this.state[type]);
    newLabels[labelIndex][name] = value;
    newLabels[labelIndex].isUpdated = false;

    this.setState({
      [type]: _.cloneDeep(newLabels)
    }, () => {
      this.modifyLabelsToReactElement(_.cloneDeep(this.state[type]), type);
    });
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

      let updateUrl = process.env.REACT_APP_ADMIN_URL + "/updateLabel";
      await axios.get(updateUrl, {
        params: {
          id: labelToUpdate.id,
          label: labelToUpdate.label,
          codeContent: labelToUpdate.codeContent,
          url: labelToUpdate.url,
          deprecated: labelToUpdate.deprecated,
          type: labelToUpdate.type
        }
      }).catch(err => {
        console.log(err);
      })

      console.log("information updated");
      let newLabels = this.state[labelType];
      newLabels[labelIndex].isUpdated = true;

      this.setState({
        [labelType]: newLabels,
        updating: false
      }, () => {
        this.modifyLabelsToReactElement(_.cloneDeep(this.state[labelType]), labelType)
      });

    } else {
      console.log("no need to update");
    }
  }

  modifyLabelsToReactElement = (rawLabels, type) => {
    const labelTab = rawLabels.map((item, index) => {
      const updateSuccess = <span style={{color: "green"}}>all contents are up-to-date</span>;

      return (
        <Tab key={index} eventKey={index} title={item.label} size="sm">
          <Form 
            style={{backgroundColor: "rgb(219, 215, 210)", padding: "15px", maxWidth: "800px"}}
            onSubmit={this.handleSubmit}
            data-label-type={type}
            data-label-index={index}
          >
            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label>Label Name</Form.Label>
                  <Form.Control 
                    name="label"
                    value={item.label}
                    onChange={this.handleLabelChange(type, index)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>URL</Form.Label>
                  <Form.Control 
                    name="url"
                    value={item.url}
                    onChange={this.handleLabelChange(type, index)}
                  />
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
              />
            </Form.Group>

            <Button variant="primary" type="submit" size="sm" disabled={this.state.updating}>
              Update
            </Button>
            <Button variant="danger" size="sm" style={{marginLeft: "5px", marginRight: "5px"}}>
              Remove
            </Button>
            <Button variant="primary" size="sm">
              Add Another Label
            </Button>
            <Example />
            <Form.Text className="text-muted">
              {this.state[type][index].isUpdated ? updateSuccess : "changes have not been updated"}
            </Form.Text>
          </Form>
        </Tab>
      );
    });

    const tabsName = type + "Tabs";
    const bigTabs = 
      <Tabs
        className="myClass" 
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

// function Example() {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//     <>
//       <Button variant="primary" onClick={handleShow}>
//         Launch demo modal
//       </Button>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Modal heading</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleClose}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

export default AdminLabels;