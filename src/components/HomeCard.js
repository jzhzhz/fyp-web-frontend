import React from 'react';
import { Card } from 'react-bootstrap';

class HomeCard extends React.Component {
  render() {
    return (
      <Card className="card-root" style={{ backgroundColor: process.env.REACT_APP_HOMECARD_BGCOLOR }}>
        <Card.Img variant="top" src={this.props.imgUrl} />
        <Card.Body>
          <Card.Title style={{ fontSize: "1.2em" }}>{this.props.title}</Card.Title>
          <Card.Text>
            {this.props.text}
          </Card.Text>
          <br />
          <div style={{ position: "absolute", bottom: "0", marginBottom: "62px" }}>
            <Card.Link
              href={this.props.url}
              style={{ color: "gray", fontSize: "smaller" }}
            >
              [MORE]
            </Card.Link>
          </div>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">{this.props.date}</small>
        </Card.Footer>
      </Card>
    );
  }
}

export default HomeCard;