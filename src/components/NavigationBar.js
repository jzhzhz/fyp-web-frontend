import React from 'react';
import { Nav, Navbar, NavDropdown, Container} from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

const Styles = styled.div`
`;

class NavigationBar extends React.Component {
  /* TODO */
  // About, Academic, Admissions should be dynamic
  // staff page inside people nav should be dynamic
  constructor() {
    super();
  }

  handleClick = () => {
    axios.get("http://localhost:10480/csWeb/hello")
      .then((res) => {
        console.log(res);
        alert(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        console.log("finish requesting backend")
      });
  }

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
                <NavDropdown title="About" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#" onClick={this.handleClick}>Action</NavDropdown.Item>
                  <NavDropdown.Item href="/">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="/">Something</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="People" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/people">Faculty</NavDropdown.Item>
                  <NavDropdown.Item href="/">Research Staff</NavDropdown.Item>
                  <NavDropdown.Item href="/">Administrative Staff</NavDropdown.Item>
                </NavDropdown>
                <Nav.Item><Nav.Link href="/research">Research</Nav.Link></Nav.Item>
                <NavDropdown title="Academics" id="basic-nav-dropdown">
                  {/* TODO */}
                </NavDropdown>
                <NavDropdown title="Admissions" id="basic-nav-dropdown">
                  {/* TODO */}
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