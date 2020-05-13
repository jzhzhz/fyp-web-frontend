import React from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

class Faculty extends React.Component {
  constructor() {
    super();
    this.state = {
      facultyList: []
    };
  }

  componentDidMount() {

  }

  getFacultyByType = async (type) => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getFacultyByType?type=" + type;
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
      });

    if (res.status === 200 && res.data.code === 0) {      
      this.setState({
        facultyList: res.data.data
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <br />
        <h2>Faculty</h2>
        <hr />
        <p>regular faculty</p>
        
        <Table striped bordered hover size="sm">
          <thead style={{backgroundColor: "#066baf", color: "white"}}>
            <tr>
              <th>name</th>
              <th>phone</th>
              <th>office</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mark Otto</td>
              <td>123</td>
              <td>102</td>
              <td>123@abc</td>
            </tr>
            <tr>
              <td>Jacob Thorton</td>
              <td>123</td>
              <td>102</td>
              <td>123@abc</td>
            </tr>
            <tr>
              <td>Larry Bird</td>
              <td>123</td>
              <td>102</td>
              <td>123@abc</td>
            </tr>
            <tr>
              <td>Jessica Jones</td>
              <td>123</td>
              <td>102</td>
              <td>123@abc</td>
            </tr>
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
} 

export default Faculty;