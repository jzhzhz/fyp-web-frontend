import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';

class Profile extends React.Component {

  componentDidMount() {
    // get all detailed information
  }
  
  render() {

    return (
      <React.Fragment>
        <h3>{this.props.match.params.name}</h3>
        <hr />
        <Row>
          <Col sm={"auto"}>
            <Image src="/pictures/aurora.jpg" rounded style={{maxWidth: "250px", height: "300px"}}/>
            <br />
            <br />
            <div>
              <p>Xiamen University Malaysia</p>
              <p>phone no. 1887415157</p>
              <p>email 123@456.com</p>
            </div>
          </Col>
          <Col sm={9}>
            <div className="intro">
              <p>You can now view fyp-web-frontend in the browser.
                Local:            http://localhost:3000        
                On Your Network:  http://192.168.192.1:3000    

                Note that the development build is not optimized.
                To create a production build, use yarn build. 
              </p>
              <br />

              <h5>News</h5>
              <hr />
              <Row>
                <Col sm={"auto"}>
                  <p>2020.1.2</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her certainty something.</p>
                </Col>
              </Row>
              <Row>
                <Col sm={"auto"}>
                  <p>2020.1.2</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her certainty something.</p>
                </Col>
              </Row>
              <Row>
                <Col sm={"auto"}>
                  <p>2020.1.2</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her certainty something.</p>
                </Col>
              </Row>
              <br />

              <h5>Publications</h5>
              <hr />
              <Row>
                <Col sm={"auto"}>
                  <p>2020.1.2</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her certainty something.</p>
                </Col>
              </Row>
              <Row>
                <Col sm={"auto"}>
                  <p>2020.1.2</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her certainty something.</p>
                </Col>
              </Row>
              <Row>
                <Col sm={"auto"}>
                  <p>2020.1.2</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her certainty something.</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <hr />
      </React.Fragment>
    );
  }
}

export default Profile;
