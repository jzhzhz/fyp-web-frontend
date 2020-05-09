import React from 'react';
import { ListGroup } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  a:hover {
    color: grey;
  }

  .list-group {
    width: 300px;
  }
`;

export const AdminMain = (props) => {
  return (
    <Styles>
      <React.Fragment>
        <h2>Main Page for Admin</h2>
        <hr />
        <ListGroup className="list-group">
          <ListGroup.Item as="a" variant="secondary" href="/admin/home">Home Text Block Setting</ListGroup.Item>
          <ListGroup.Item as="a" variant="secondary" href="/admin/labels">Label Setting</ListGroup.Item>
          <ListGroup.Item as="a" variant="secondary" href="/">Back to Home</ListGroup.Item>
        </ListGroup>
      </React.Fragment>
    </Styles>
  );
}