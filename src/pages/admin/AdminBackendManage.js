import React from 'react';
import { Table, Form, Spinner } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import axios from 'axios';
import styled from 'styled-components';

const Styles = styled.div`
  a {
    color: #6097c4;
  }
`;

class AdminBackendManage extends React.Component {
  constructor() {
    super();
    this.state = {
      isExcelValid: false,
      invalidMsg: "",
      waiting: false
    };
  }

  componentDidMount() {
    bsCustomFileInput.init();
  }

  handleExcelFileChange = async (event) => {
    console.log("handling excel change");
    // prevent default behavior
    // initialize url, file and file data
    event.preventDefault();
    const url = process.env.REACT_APP_ADMIN_URL + "/uploadExcelFile";
    // const fileName = event.target.files[0].name
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    this.setState({ waiting: true });
    const res = await axios.post(url, formData, {
      headers: {'Content-type': 'multipart/form-data'}
    }).catch(err => {
      console.log(err);
      return err;
    });
    this.setState({ waiting: false });

    if (res.status === 200) {
      this.setState({
        isExcelValid: true
      });
    } else {
      this.setState({
        isExcelValid: false
      });
    }
  }



  render() {
    const spin = this.state.waiting ? <Spinner animation="border" size="sm" /> : null;

    return (
      <Styles>
        <React.Fragment>
          <h3>Backend Data Download & Update</h3>
          <a style={{color: "gray"}} href="/admin/main">{"<<"} return to main setting page</a>
          <hr />
          <h5>Download Backend Files</h5>

          <Table striped bordered hover size="sm" style={{marginTop: "20px", width: "800px"}}>
            <thead style={{backgroundColor: "#066baf", color: "white"}}>
              <tr>
                <th>file</th>
                <th>description</th>
                <th>last update</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>            
                  <a 
                    href={process.env.REACT_APP_ADMIN_URL + "/getFacultyExcelFile"}
                    style={{marginRight: "10px"}}
                  >
                    [faculty-list.xlsx]
                  </a>
                </td>
                <td>contains lists of faculty and admin information</td>
                <td>2020.5.30</td>
              </tr>

              <tr>
                <td>            
                  <a 
                    href={process.env.REACT_APP_ADMIN_URL + "/getHomePageExcelFile"}
                    style={{marginRight: "10px"}}
                  >
                    [home-information.xlsx]
                  </a>
                </td>
                <td>contains lists of home information</td>
                <td>2020.5.31</td>
              </tr>

              <tr>
                <td>
                  <a 
                    href={process.env.REACT_APP_ADMIN_URL + "/getBackendData"}
                  >
                    [backend-data.zip]
                  </a>
                </td>
                <td>
                  zip file for all backend data, including code segment
                </td>
                <td>2020.5.30</td>
              </tr>
            </tbody>
          </Table>
          <br />

          <h5>Upload Excel File to Update Faculty Information</h5>
          <Form style={{marginTop: "15px"}}>
            <Form.Group>
              <Form.Label>
                The file format should be EXACTLY the same as the  
                  <a 
                    href={process.env.REACT_APP_ADMIN_URL + "/getFacultyExcelFile"}
                    style={{marginRight: "8px", marginLeft: "8px"}}
                  >
                    [faculty-list.xlsx]
                  </a> 
                above!
              </Form.Label>
              <br />
              <Form.Label>File name will be recognized to update corresponding original data.</Form.Label>
              <br />
              <Form.File label="Custom file input" style={{width: "400px"}} custom> 
              <Form.File.Input 
                isValid={this.state.isExcelValid}
                isInvalid={!this.state.isExcelValid} 
                onChange={this.handleExcelFileChange}
              />
              <Form.File.Label data-browse="Choose File">
                upload excel file here
              </Form.File.Label>
              {spin}
              <Form.Control.Feedback type="valid">
                excel file upload success, data updated success!
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid" style={{color: "red"}}>
                invalid file!
              </Form.Control.Feedback>
            </Form.File>
            </Form.Group>
          </Form>
        </React.Fragment>
      </Styles>
    );
  }
}

export default AdminBackendManage;
