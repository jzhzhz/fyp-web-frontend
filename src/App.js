import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { About } from './About';
import { People } from './People';
import { NoMatch } from './NoMatch';
import { Layout } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />         
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/people" component={People} />
              <Route component={NoMatch} />
            </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
