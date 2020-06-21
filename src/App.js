import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

// import website presentation pages
import Home from './pages/Home';
import LabelPage from './pages/LabelPage';
import Faculty from './pages/people/Faculty';
import ResearchStaff from './pages/people/ResearchStaff';
import AdminStaff from './pages/people/AdminStaff';
import { Research } from './pages/Research';
import { NoMatch } from './NoMatch';
import Profile from './pages/people/Profile';

// import admin management pages
import Login from './pages/Login';
import { AdminMain } from './pages/admin/AdminMain';
import AdminHome from './pages/admin/AdminHome';
import AdminLabels from './pages/admin/AdminLabels';
import AdminBackendManage from './pages/admin/AdminBackendManage';
// import { StaffMain } from './pages/staff/StaffMain';
import StaffProfile from './pages/staff/StaffProfile';

// import layout and sub-components
import { Layout } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import Jumbotron from './components/Jumbotron';
import Footer from './components/Footer';

/**
 * main application component, 
 * handling routing, pagestructure 
 * and login validation 
 */
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isAuthed: false,
      username: "",
      password: ""
    };
  }

  /** handle changes in login page */
  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  /** login button handler in login page */
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

  /** create admin-only route */
  AdminRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      (sessionStorage.getItem("isAuthed") === "admin")
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  /** create staff-only route */
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
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/research" component={Research} />

              {/* route label page in navbar labels */}
              <Route path="/details/:page" component={LabelPage} />

              {/* route faculty info pages and profiles */}
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

              {/* route login page and all the props */}
              <Route path="/login" render={(props) => 
                <Login {...props} 
                  isAuthed={this.state.isAuthed}
                  username={this.state.username}
                  password={this.state.password}
                  handleChange={this.handleChange}
                  handleAppSubmit={this.handleAppSubmit}
                  notice={this.state.notice}
                />}
              />

              {/* route for admin pages this.Admin */}
              <this.AdminRoute path="/admin/main" component={AdminMain} />
              <this.AdminRoute path="/admin/home" component={AdminHome} />
              <this.AdminRoute path="/admin/labels" component={AdminLabels} />
              <this.AdminRoute path="/admin/backend" component={AdminBackendManage} />
              <this.AdminRoute path="/staff/profile-setting" component={StaffProfile} />

              {/* route to 404 not found page */}
              <Route component={NoMatch} />
            </Switch>
          </Layout>   
        </Router>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
