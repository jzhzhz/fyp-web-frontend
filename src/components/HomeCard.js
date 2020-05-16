import React from 'react';
import { Card } from 'react-bootstrap';
// import styled from 'styled-components';

// const Styles = styled.div`
//   .card-body {
//     background-color: rgb(236, 230, 225);
//     min-height: 31vh;
//   }

//   .card-link {
//     color: grey;
//     font-size: small;
//   }
// `;

class HomeCard extends React.Component {
  render() {
    return (
        <Card style={{backgroundColor: "rgb(236, 230, 225)"}}>
          <Card.Img variant="top" src={this.props.imgUrl} />
          <Card.Body>
            <Card.Title style={{fontSize: "1.2em"}}>{this.props.title}</Card.Title>
            <Card.Text>
              {this.props.text}
            </Card.Text>
            <br />
            <div  style={{position: "absolute", bottom: "0", marginBottom: "62px"}}>
            <Card.Link className="card-link" href={this.props.url} style={{color: "gray", fontSize: "smaller"}}>[MORE]</Card.Link>
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