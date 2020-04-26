import React from 'react';
import { Container, Table } from 'react-bootstrap';

class Faculty extends React.Component {
  render() {
    return (
      <Container>
        <br />
        <h2>Faculty</h2>
        <hr />
        <p>regular faculty</p>
        
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
      </Container>
    );
  }
} 

export default Faculty;