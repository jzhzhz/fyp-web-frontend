import React from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

class ResearchStaff extends React.Component {
  constructor() {
    super();
    this.state = {
      facultyList: [],
      facultyListElement: []
    };
  }

  componentDidMount() {
    this.getFacultyByType("research");
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
      }, () => {
        this.renderFacultyListElement(this.state.facultyList);
      });
    }
  }

  renderFacultyListElement = (facultyList) => {
    facultyList = facultyList.map((faculty, index) => {
      let link;
      if (faculty.url === "") {
        link = faculty.name;
      } else if (faculty.url.includes("https://")) {
        link = <a 
          target="_blank" 
          href={faculty.url} 
          rel="noopener noreferrer"
          style={{color: "black"}}
        >
          {faculty.name}
        </a>;
      } else {
        link = <a href={faculty.url} style={{color: "black"}}>{faculty.name}</a>;
      }

      return (
        <React.Fragment>
          <tr>
            <td>{link}</td>
            <td>{faculty.phone}</td>
            <td>{faculty.office}</td>
            <td>{faculty.email}</td>
          </tr>
        </React.Fragment>
      );
    });

    this.setState({
      facultyListElement: _.cloneDeep(facultyList)
    });
  }

  render() {
    return (
      <React.Fragment>
        <br />
        <h2>Research Staff</h2>
        <hr />
        <p>Post-doctoral</p>
        
        <Table striped bordered hover size="sm" style={{textAlign: "center"}}>
          <thead style={{backgroundColor: "#066baf", color: "white"}}>
            <tr>
              <th>name</th>
              <th>phone</th>
              <th>office</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {this.state.facultyListElement}
          </tbody>
        </Table>
      </React.Fragment>
    );
  }
} 

export default ResearchStaff;