import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  .card-body {
    background-color: rgb(236, 230, 225);
    min-height: 31vh;
  }

  .card-link {
    color: grey;
    font-size: small;
  }
`;

class HomeCard extends React.Component {
  render() {
    let carTextId = 0;
    const cardText = this.props.textList.map(
      text => <Card.Text key={++carTextId}>{text}</Card.Text>
    );

    return (
      <Styles>
        <Card key={this.props.key}>
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