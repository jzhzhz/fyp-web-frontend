import React from 'react';
import { Form, Button, Tabs, Tab } from 'react-bootstrap';
import '../styles/tabs.css';

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
    const { name } = event.target;
    console.log("login type: " + name); 
    const checkResult = await this.props.handleAppSubmit(name);
    
    console.log("check result: " + checkResult);
    if (checkResult) {
      sessionStorage.setItem("isAuthed", "admin");
      sessionStorage.setItem("username", this.props.username);
      this.setState({
        isAuthed: true
      })
    
      if (name === "admin") {
        this.props.history.push('/admin/main');
      } else {
        this.props.history.push('/staff/main');
      }
        
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

  getLoginFormByType = (loginType) => {
    return (
      <Form 
        style={{width: "350px", backgroundColor: "rgb(219, 215, 210)", padding: "20px"}} 
        name={loginType} 
        onSubmit={this.handleSubmit}
      >
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            name="username" 
            value={this.props.username} 
            onChange={this.props.handleChange} 
            placeholder="Enter username"
            style={{width: "240px"}} 
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
            style={{width: "240px"}}  
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
    );
  }
  
  render() {
    const adminLogin = this.getLoginFormByType("admin");
    const staffLogin = this.getLoginFormByType("staff");

    return (
      <React.Fragment>
        <Tabs style={{width: "240px"}} className="myClass" defaultActiveKey="admin">
          <Tab eventKey="admin" title="Admin Login">
            {adminLogin}
          </Tab>
          <Tab eventKey="staff" title="Staff Login">
            {staffLogin}
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default Login;
