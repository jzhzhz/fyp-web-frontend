import React from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

const Styles = styled.div`
`;

class NavigationBar extends React.Component {
  /* TODO */
  // staff page inside people nav should be dynamic
  constructor() {
    super();
    this.state = {
      aboutLabels: [],
      academicsLabels: [],
      admissionsLabels: []
    };
  }

  getAboutLabel = async () => {
    const res = await axios.get("http://localhost:10480/csWeb/getAboutLabels");

    if (res.status === 200 && res.data.code === 0) {
      let aboutLabelsRes = res.data.data;

      aboutLabelsRes = aboutLabelsRes.map(
        obj => <NavDropdown.Item key={obj.id} href="#">{obj.label}</NavDropdown.Item>
      );

      this.setState((prevState) => {
        return {
          ...prevState,
          aboutLabels: aboutLabelsRes
        };
      });
      console.log("get About labels success!");
    } else {
      console.log("get About labels failed!");
    }
  }

  getAcademicsLabel = async () => {
    const res = await axios.get("http://localhost:10480/csWeb/getAcademicsLabels");

    if (res.status === 200 && res.data.code === 0) {
      let academicsLabelsRes = res.data.data;

      academicsLabelsRes = academicsLabelsRes.map(
        obj => <NavDropdown.Item key={obj.id} href="#">{obj.label}</NavDropdown.Item>
      );

      this.setState((prevState) => {
        return {
          ...prevState,
          academicsLabels: academicsLabelsRes
        };
      });
      console.log("get Academics labels success!");
    } else {
      console.log("get Academics labels failed!");
    }
  }

  getAdmissionsLabel = async () => {
    const res = await axios.get("http://localhost:10480/csWeb/getAdmissionsLabels");

    if (res.status === 200 && res.data.code === 0) {
      let admissionsLabelsRes = res.data.data;

      admissionsLabelsRes = admissionsLabelsRes.map(
        obj => <NavDropdown.Item key={obj.id} href="#">{obj.label}</NavDropdown.Item>
      );

      this.setState((prevState) => {
        return {
          ...prevState,
          admissionsLabels: admissionsLabelsRes
        };
      });
      console.log("get Admissions labels success!");
    } else {
      console.log("get Admissions labels failed!");
    }
  }

  componentWillMount() {
    this.getAboutLabel();
    this.getAcademicsLabel();
    this.getAdmissionsLabel();
  }

  // handleClick = () => {

  // }

  render() {
    return (
      <Styles>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">XMUM</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                <NavDropdown title="About" id="basic-nav-dropdown" onClick={this.handleClick}>
                  {this.state.aboutLabels}
                </NavDropdown>
                <NavDropdown title="People" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/faculty">Faculty</NavDropdown.Item>
                  <NavDropdown.Item href="/researchStaff">Research Staff</NavDropdown.Item>
                  <NavDropdown.Item href="/adminStaff">Administrative Staff</NavDropdown.Item>
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