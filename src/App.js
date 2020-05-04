import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import axios from 'axios';

import Home from './Home';
import { Overview } from './pages/about/Overview';
import Faculty from './pages/people/Faculty';
import ResearchStaff from './pages/people/ResearchStaff';
import AdminStaff from './pages/people/AdminStaff';
import { Research } from './pages/Research';
import { NoMatch } from './NoMatch';
import Profile from './pages/people/Profile';

import Login from './pages/Login';
import Admin from './pages/Admin';

import { Layout } from './components/Layout';
import NavigationBar from './components/NavigationBar';
import { Jumbotron } from './components/Jumbotron';
import Footer from './components/Footer';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      jumboTextBlock: {}
    };
  }

  componentDidMount() {
    this.getJumbotronText();
  }

  getJumbotronText = async () => {
    let res = {};
    const url = process.env.REACT_APP_BACKEND_URL + "/getHomeTextBlockByType?type=jumbo";
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
      });

      if (res.status === 200 && res.data.code === 0) {
        this.setState((prevState) => {
          return {
            ...prevState,
            jumboTextBlock: res.data.data[0]
          };
        });
        console.log(this.state.jumboTextBlock);
        console.log(this.state.jumboTextBlock.contentList);
      }
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />
          <Jumbotron textBlock={this.state.jumboTextBlock}/>
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
              <Route path="/admin" component={Admin} />

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
