import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
  a {
    color: gray;
    font-size: small;
  }
`;

class Profile extends React.Component {

  componentDidMount() {
    // get all detailed information
  }
  
  render() {

    return (
      <Styles>
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
                To create a production build, use yarn build. 
              </p>
              <br />

              <h5>News</h5>
              <hr />
              <Row>
                <Col sm={"auto"}>
                  <p>Jan 28, 2020</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her.</p>
                </Col>
              </Row>
              <Row>
                <Col sm={"auto"}>
                <p>Jan 28, 2020</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her.</p>
                </Col>
              </Row>
              <Row>
                <Col sm={"auto"}>
                <p>Jan 28, 2020</p>
                </Col>
                <Col>
                  <p>Better of always missed we person mr. September smallness northward situation few her.</p>
                </Col>
              </Row>
              <br />

              <h5>Publications</h5>
              <hr />
              <Row style={{marginBottom: "20px"}}>
                <Col sm={"auto"}>
                  <img 
                    src="/pictures/river.jpg"
                    alt="profile"
                    height="130" width="220"
                  />
                </Col>
                <Col style={{paddingLeft: "5px"}}>
                  <p style={{marginBottom: "5px"}}><b>Better of always missed we person</b></p>
                  <p style={{marginBottom: "5px"}}>
                    You can now view fyp-web-frontend in the browser.

                    Local:            http://localhost:3000        
                    On Your Network:  http://192.168.192.1:3000    
                    On Your Network:  http://192.168.192.1:3000    
                    On Your Network:  http://192.168.192.1:3000    
                  </p>
                  <a href="/">[MORE]</a>
                </Col>
              </Row>
              <Row>
                <Col sm={"auto"}>
                  <img 
                    src="/pictures/river.jpg"
                    alt="profile"
                    height="130" width="220"
                  />
                </Col>
                <Col style={{paddingLeft: "5px"}}>
                  <p style={{marginBottom: "5px"}}><b>Better of always missed we person</b></p>
                  <p style={{marginBottom: "5px"}}>
                    You can now view fyp-web-frontend in the browser.

                    Local:            http://localhost:3000        
                    On Your Network:  http://192.168.192.1:3000    
                    On Your Network:  http://192.168.192.1:3000    
                    On Your Network:  http://192.168.192.1:3000    
                  </p>
                  <a href="/">[MORE]</a>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <hr />
      </React.Fragment>
      </Styles>
    );
  }
}

export default Profile;
