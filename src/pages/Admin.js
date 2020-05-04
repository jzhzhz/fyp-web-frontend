import React from 'react';
import { Form, Button } from 'react-bootstrap';

class Admin extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h3>Settings</h3>
        <hr />
        <div style={{width: "50%"}}>
        <h5>Jumbotron Settings</h5>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Jumbotron Title</Form.Label>
            <Form.Control type="input" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Subtitle</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;