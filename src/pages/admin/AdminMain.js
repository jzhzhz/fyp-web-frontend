import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  .list-group a:hover {
    color: grey;
  }

  .list-group {
    width: 300px;
  }

  .bt {
    background-color: #2386c9;
  }

  .bt:hover {
    background-color: #0d588a;
  }
`;

const handleLogout = () => {
  sessionStorage.setItem("isAuthed", "false");
  sessionStorage.removeItem("username");
}

export const AdminMain = (props) => {
  return (
    <Styles>
      <React.Fragment>
        <h3>Settings</h3>
        <hr />
        <ListGroup className="list-group">
          <ListGroup.Item as="a" variant="secondary" href="/admin/home">Home Text Block Setting</ListGroup.Item>
          <ListGroup.Item as="a" variant="secondary" href="/admin/labels">Label Setting</ListGroup.Item>
          <ListGroup.Item as="a" variant="secondary" href="/staff/profile-setting">Profile Setting</ListGroup.Item>
        </ListGroup>
        <br />

        <h3>Navigation</h3>
        <hr />
        <ListGroup className="list-group">
          <ListGroup.Item as="a" variant="secondary" href="/">Back to Home</ListGroup.Item>
        </ListGroup>
        <br />

        <h3>Utilities</h3>
        <hr />
        <ListGroup className="list-group">
          <ListGroup.Item 
            as="a" 
            variant="secondary" 
            href={process.env.REACT_APP_ADMIN_URL + "/getFacultyExcelFile"}
          >
            Download Faculties Excel File
          </ListGroup.Item>
        </ListGroup>

        <hr/>
        <Button className="bt" href="/" onClick={handleLogout}>logout</Button>
      </React.Fragment>
    </Styles>
  );
}