import React from 'react';
import { Container } from 'react-bootstrap';

/** adding Container for every page components */
export const Layout = (props) => (
  <Container>
    <div style={{minHeight: "80vh"}}>
      {props.children}
    </div>
  </Container>
)