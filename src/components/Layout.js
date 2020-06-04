import React from 'react';
import { Container } from 'react-bootstrap';

/** adding Container for every page components */
export const Layout = (props) => (
  <Container>
    {props.children}
  </Container>
)