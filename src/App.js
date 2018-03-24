import React, { Component } from 'react';
import { Route, Switch, withRouter} from 'react-router-dom';

import Index from './container/index'
import About from './container/about'

@withRouter
class App extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Index}></Route>
          <Route exact path="/about" component={About}></Route>
        </Switch>
      </div>
    );
  }
}

export default App;
