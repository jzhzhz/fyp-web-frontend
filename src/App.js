import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Home } from './Home';
import { Overview } from './pages/about/Overview';
import Faculty from './pages/people/Faculty';
import ResearchStaff from './pages/people/ResearchStaff';
import AdminStaff from './pages/people/AdminStaff';
import { Research } from './pages/Research';
import { NoMatch } from './NoMatch';

import { Layout } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import { Jumbotron } from './components/Jumbotron';
import HomeFooter from './components/Footer';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />
          <Jumbotron />
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

            <Route path="/research" component={Research}/>

            <Route component={NoMatch} />
          </Switch>
          </div>
          </Layout>   
        </Router>
        <HomeFooter />
      </React.Fragment>
    );
  }
}

export default App;
