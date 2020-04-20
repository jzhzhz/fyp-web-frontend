import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { About } from './pages/about/About';
import { Faculty } from './pages/people/Faculty';
import { NoMatch } from './NoMatch';
// import { Layout } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import HomeFooter from './components/HomeFooter';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />
          <div style={{minHeight: "80vh"}}>      
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/faculty" component={Faculty} />
            <Route component={NoMatch} />
          </Switch>
          </div>   
          <HomeFooter />
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
