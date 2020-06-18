import React from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

class Faculty extends React.Component {
  constructor() {
    super();
    this.state = {
      facultyList: [],
      facultyListElement: []
    };
  }

  componentDidMount() {
    this.getFacultyByType("regular");
  }

  // componentWillUnmount() {
  //   // disable setState action when unmounting components
  //   this.setState = (state, callback)=>{
  //     return;
  //   };
  // }

  getFacultyByType = async (type) => {
    const url = process.env.REACT_APP_BACKEND_URL + "/getFacultyByType?type=" + type;
    
    console.log("getting res");

    const res = await axios.get(url)
      .catch((err) => {
        console.log(err);
      });
    
    console.log("the res is ");
    console.log(res);

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
        <tr key={`faculty ${index}`}>
          <td key={`faculty ${index} link`}>{link}</td>
          <td key={`faculty ${index} phone`}>{faculty.phone}</td>
          <td key={`faculty ${index} office`}>{faculty.office}</td>
          <td key={`faculty ${index} email`}>{faculty.email}</td>
        </tr>
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
        <h2>Faculty</h2>
        <hr />
        <p>regular faculty</p>
        
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

export default Faculty;