import React from 'react';
import { Jumbotron as Jumbo, Container } from 'react-bootstrap';
import styled from 'styled-components';
import mountImg from '../assets/mountain_bg.jpg';

const Styles = styled.div``;

export const Jumbotron = () => (
  <Styles>
    <Jumbo fluid className="jumbo">
      <div className="overlay"></div>
      <Container>
        <h1>welcome</h1>
        <p>vnraiobaionovia</p>
      </Container>
    </Jumbo>
  </Styles>
)