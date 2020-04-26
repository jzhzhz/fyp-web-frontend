import React from 'react';
import { Table } from 'react-bootstrap';

class AdminStaff extends React.Component {
  render() {
    return (
      <React.Fragment>
        <br />
        <h2>Administrative Staff</h2>
        <hr />
        <p>Administration</p>
        
        <Table striped bordered hover size="sm">
          <thead>
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

export default AdminStaff;