import React from 'react';
import '../styles/footer.css'
import { Container, Row, Col } from 'react-bootstrap';

function HomeFooter() {
  return (
    <React.Fragment>
    <div className="footer">
      <Container>
        <Row>
          <Col className="leftblock">        
            <img 
              src="./pictures/xmum_longlogo.jpg"
              alt="xmum_logo"
              width="300"
              height="100"
            />
          </Col>
          <Col className="rightblock">
            <div className="footnote1">
              <span>Home page</span>
              <span>Contact us</span>
            </div>
            <div className="footnote2">
              <span>Terms of Use</span>
              <span>Privacy</span>
              <span>Copyright</span>
            </div>
            <div className="footnote3">
              <span>© Xiamen University Malaysia, Selangor, Malaysia.</span>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
    </React.Fragment>
  );
}

export default HomeFooter;