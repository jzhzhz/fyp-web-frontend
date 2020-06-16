import React from 'react';
import '../styles/footer.css'
import { Container, Row } from 'react-bootstrap';
import Logo from '../assets/longpng_logo.png';

function Footer() {
  return (
    <React.Fragment>
      <div className="footer" style={{backgroundColor: process.env.REACT_APP_FOOTER_BGCOLOR}}>
        <Container>
          <Row>
            <div className="leftblock">
              <img className="logopic"
                src={Logo}
                alt="xmum_logo"
              />
            </div>
            <div className="rightblock">
              <div className="footnote1">
                <ul className="upperlist">
                  <li><a href="http://www.xmu.edu.my/">Home Page</a></li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div className="footnote2">
                <ul className="bottomlist">
                  <li>Terms of Use</li>
                  <li>Privacy</li>
                  <li id="lastOne">Copyright</li>
                </ul>
              </div>
              <div className="footnote3">
                <span>© Xiamen University Malaysia, Selangor, Malaysia.</span>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Footer;