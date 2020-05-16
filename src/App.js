import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import LabelPage from './pages/LabelPage';
import Faculty from './pages/people/Faculty';
import ResearchStaff from './pages/people/ResearchStaff';
import AdminStaff from './pages/people/AdminStaff';
import { Research } from './pages/Research';
import { NoMatch } from './NoMatch';
import Profile from './pages/people/Profile';

import Login from './pages/Login';
import { AdminMain } from './pages/admin/AdminMain';
import AdminHome from './pages/admin/AdminHome';
import AdminLabels from './pages/admin/AdminLabels';
// import { StaffMain } from './pages/staff/StaffMain';
import StaffProfile from './pages/staff/StaffProfile';

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

  handleAppSubmit = async (loginType) => {
    let checkResult = false;
    const url = process.env.REACT_APP_ADMIN_URL + "/checkAdmin?" +
                  "name=" + this.state.username +
                  "&password=" + this.state.password +
                  "&type=admin";

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
      sessionStorage.setItem("isAuthed", loginType);
      sessionStorage.setItem("username", this.state.username);
    } 

    return checkResult;
  }

  AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      (sessionStorage.getItem("isAuthed") === "admin")
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  StaffRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      (sessionStorage.getItem("isAuthed") === "admin" ||
       sessionStorage.getItem("isAuthed") === "staff")
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar username={this.state.username} auth={this.state.isAuthed}/>
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

              {/* route for admin pages this.Admin */}
              <this.AdminRoute path="/admin/main" component={AdminMain} />
              <this.AdminRoute path="/admin/home" component={AdminHome} />
              <this.AdminRoute path="/admin/labels" component={AdminLabels} />
              <this.AdminRoute path="/staff/profile-setting" component={StaffProfile} />

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

export default App;
