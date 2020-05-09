import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

import Home from './Home';
import LabelPage from './pages/LabelPage';
import Faculty from './pages/people/Faculty';
import ResearchStaff from './pages/people/ResearchStaff';
import AdminStaff from './pages/people/AdminStaff';
import { Research } from './pages/Research';
import { NoMatch } from './NoMatch';
import Profile from './pages/people/Profile';

import { AdminMain } from './pages/admin/AdminMain';
import AdminHome from './pages/admin/AdminHome';
import AdminLabels from './pages/admin/AdminLabels';

import { Layout } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import Jumbotron from './components/Jumbotron';
import Footer from './components/Footer';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isAuthed: false,
      username: "",
      password: ""
    };
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  handleAppSubmit = async () => {
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
      this.setState({
        isAuthed: true
      });
    } 

    return checkResult;
  }

  PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      this.state.isAuthed === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  handleLogout = () => {

  }

  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar auth={this.state.isAuthed} name={this.state.username}/>
          <Jumbotron/>
          <Layout>
          <div style={{minHeight: "80vh"}}>      
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/details/:page" component={LabelPage} />

              <Route path="/people/faculty">
                <Faculty />
              </Route>
              <Route path="/people/research-staff">
                <ResearchStaff />
              </Route>
              <Route path="/people/admin-staff">
                <AdminStaff />
              </Route>

              <Route path="/people/~:name" component={Profile} />

              <Route path="/research" component={Research} />

              {/* route for admin pages this.Private */}
              <Route path="/login" render={(props) => 
                <Login {...props} 
                  isAuthed={this.state.isAuthed}
                  username={this.state.username}
                  password={this.state.password}
                  handleChange={this.handleChange}
                  handleAppSubmit={this.handleAppSubmit}
                  notice={this.state.notice}
                />
              }/>

              <Route path="/admin/main" component={AdminMain} />
              <Route path="/admin/home" component={AdminHome} />
              <Route path="/admin/labels" component={AdminLabels} />

              {/* route to 404 not found page */}
              <Route component={NoMatch} />
            </Switch>
          </div>
          </Layout>   
        </Router>
        <Footer />
      </React.Fragment>
    );
  }
}

class Login extends React.Component {
  constructor() {
    super();
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
    );
  }
}

export default App;
