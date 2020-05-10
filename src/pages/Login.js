import React from 'react';
import { Form, Button, Tabs, Tab } from 'react-bootstrap';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notice: "",
      passwordHidden: true,
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const checkResult = await this.props.handleAppSubmit();
    
    console.log("check result: " + checkResult);
    if (checkResult) {
      sessionStorage.setItem("isAuthed", "true");
      sessionStorage.setItem("username", this.props.username);
      this.setState({
        isAuthed: true
      })

      this.props.history.push('/admin/main');
    } else {
      this.setState({
        notice: "invalid username or password"
      });
    }
  }

  handleShowPassword = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        passwordHidden: !prevState.passwordHidden
      };
    });
  }
  
  render() {
    return (
      <React.Fragment>
      <Form style={{width: "200px"}} onSubmit={this.handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            name="username" 
            value={this.props.username} 
            onChange={this.props.handleChange} 
            placeholder="Enter username" 
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type={this.state.passwordHidden ? "password" : "input"} 
            name="password"
            value={this.props.password} 
            onChange={this.props.handleChange}  
            placeholder="Password" 
          />
          <Form.Text className="text-muted">
            <span style={{color: "red"}}>{this.state.notice}</span>
          </Form.Text>
        </Form.Group>
        
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="show password" onClick={this.handleShowPassword}/>
        </Form.Group>

        <Button style={{backgroundColor: "#066baf"}} type="submit">
          Login
        </Button>
      </Form>
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
        <Tab eventKey="home" title="Home">
          test
        </Tab>
        <Tab eventKey="profile" title="Profile">
          test
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled>
          test
        </Tab>
      </Tabs>
      </React.Fragment>
    );
  }
}

export default Login;
