import React from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

const Styles = styled.div`
  .nav-bar {
    background-color: #066baf;
  }
`;

class NavigationBar extends React.Component {
  constructor() {
    super();
    this.state = {
      aboutLabels: [],
      academicsLabels: [],
      admissionsLabels: []
    };
  }

  getLabel = async (labelType) => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getLabels?labelType=" + labelType;
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
      });

    if (res.status === 200 && res.data.code === 0) {
      let labelsRes = res.data.data;

      labelsRes = labelsRes.map(
        // change the label text to navbar dropdown item
        obj => <NavDropdown.Item key={obj.id} href={obj.url}>{obj.label}</NavDropdown.Item>
      );

      const stateLabelName = labelType + "Labels";

      this.setState((prevState) => {
        return {
          ...prevState,
          [stateLabelName]: labelsRes,
        };
      });
      
      console.log(`get ${labelType} labels success!`);
    } else {
      console.log(`get ${labelType} labels failed!`);
    }
  }

  componentDidMount() {
    this.getLabel("about");
    this.getLabel("academics");
    this.getLabel("admissions");
  }

  render() {
    return (
      <Styles>
        <Navbar className="nav-bar" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="http://www.xmu.edu.my/">XMUM</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                <NavDropdown title="About" id="basic-nav-dropdown" onClick={this.handleClick}>
                  {this.state.aboutLabels}
                </NavDropdown>
                <NavDropdown title="People" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/people/faculty">Faculty</NavDropdown.Item>
                  <NavDropdown.Item href="/people/research-staff">Research Staff</NavDropdown.Item>
                  <NavDropdown.Item href="/people/admin-staff">Administrative Staff</NavDropdown.Item>
                </NavDropdown>
                <Nav.Item><Nav.Link href="/research">Research</Nav.Link></Nav.Item>
                <NavDropdown title="Academics" id="basic-nav-dropdown">
                  {this.state.academicsLabels}
                </NavDropdown>
                <NavDropdown title="Admissions" id="basic-nav-dropdown">
                  {this.state.admissionsLabels}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Styles>
    );
  }
}

export default NavigationBar;