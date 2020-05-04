import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      notice: "",
      passwordHidden: true,
    };
  }

  handleShowPassword = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        passwordHidden: !prevState.passwordHidden
      };
    });
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState((prevState) => {
      return {
        ...prevState,
        [name]: value
      };
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    let checkResult = false;

    const url = process.env.REACT_APP_ADMIN_URL + "/checkAdmin?" +
                  "name=" + this.state.username +
                  "&password=" + this.state.password;

    await axios.get(url)
      .then((getRes) => {
        checkResult = getRes.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    if (checkResult) {
      this.props.history.push('/admin');
    } else {
      this.setState((prevState) => {
        return {
          ...prevState,
          notice: "invalid username or password"
        };
      });
    }
  }
  
  render() {

    return (
      <Form style={{width: "20%"}} onSubmit={this.handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" onChange={this.handleChange} placeholder="Enter username" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type={this.state.passwordHidden ? "password" : "input"} name="password" onChange={this.handleChange}  placeholder="Password" />
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
}

export default Login;
