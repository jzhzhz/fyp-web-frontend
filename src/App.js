import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

import Home from './Home';
import { Overview } from './pages/about/Overview';
import Faculty from './pages/people/Faculty';
import ResearchStaff from './pages/people/ResearchStaff';
import AdminStaff from './pages/people/AdminStaff';
import { Research } from './pages/Research';
import { NoMatch } from './NoMatch';
import Profile from './pages/people/Profile';

// import Login from './pages/Login';
import Admin from './pages/Admin';

import { Layout } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import { Jumbotron } from './components/Jumbotron';
import Footer from './components/Footer';

let isAuthenticated = false;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      jumbo: {}
    };
  }

  componentDidMount() {
    this.getTextBlocksByType("jumbo");
  }

  getTextBlocksByType = async (type) => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getHomeTextBlockByType?type=" + type;
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
      });

    if (res.status === 200 && res.data.code === 0) {
      if (type !== "cards") {
        let resData = res.data.data[0];
        // resData.content = resData.contentList[0];

        this.setState({
          [type]: resData
        });
      } else {
        this.getDynamicTextBlocks(res.data.data);
      }

      // console.log(this.state);
    }
  }

  getDynamicTextBlocks = (resData) => {
    // do sth
    console.log(resData);
  }

  PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />
          <Jumbotron textBlock={this.state.jumbo}/>
          <Layout>
          <div style={{minHeight: "80vh"}}>      
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/about/department-overview" component={Overview} />

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

              <Route path="/login" component={Login} />
              <Route path='/admin'>
                <Admin getTextBlocksByType={this.getTextBlocksByType}/>
              </Route>
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
      isAuthenticated = true;
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
          <Form.Control 
            type={this.state.passwordHidden ? "password" : "input"} 
            name="password" 
            onChange={this.handleChange}  
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
