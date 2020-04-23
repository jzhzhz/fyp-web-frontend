import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  .card-body {
    background-color: rgb(219, 215, 210);
    min-height: 31vh;
  }

  .card-link {
    color: grey;
    font-size: small;
  }
`;

class HomeCard extends React.Component {
  render() {
    const cardText = this.props.textList.map(
      text => <Card.Text>{text}</Card.Text>
    );

    return (
      <Styles>
        <Card>
          <Card.Body className="card-body">
            <Card.Title>{this.props.title}</Card.Title>
            {/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle> */}
            {cardText}
            <Card.Link className="card-link" href={this.props.url}>[MORE]</Card.Link>
          </Card.Body>
        </Card>
      </Styles>
    );
  }
}

export default HomeCard;