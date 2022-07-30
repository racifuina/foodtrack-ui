import React, { Component } from 'react';
import Layout from './layout/';
import { withRouter, Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
//============ Routes File =============*
import routes from './routes';

//============ React Table Css =============*
import 'react-table-v6/react-table.css'
//============ Font Awesome Css =============*
import './assets/css/font-awesome.min.css';
//============ Flag Icons Css =============*
import './assets/css/flag-icon.min.css';
//============ Themify Icons Css =============*
import './assets/css/themify-icons.css';
//============ Ionicons Css =============*
import './assets/css/ionicons.min.css';
//============ Ladda Buttons Css =============*
import './assets/css/ladda.min.css';
//============ EtLine Css =============*
import './assets/css/et-line.css';
//============ Feather Css =============*
import './assets/css/feather.css';
//============ React Block ui =============*
import 'react-block-ui/style.css';
//============ Main App Scss =============*
import './App.scss';

//============ Error Pages =============*
import PageNotFound from './pages/Error/404';

//============ Fake Backend =============*
import fakeBackend from './helpers/fakeBackend';

//============ Auth Functions =============*
import { isUserAuthenticated } from './helpers/authUtils';

//============ Initialize FakeBackend =============*
fakeBackend();

//============ Components with Sidebar and topbar =============*
function layoutWithSidebarAndHeader(WrappedComponent) {
  return class extends React.Component {

    render() {
      return <Layout>
        <WrappedComponent {...this.props}></WrappedComponent>
      </Layout>
    }
  };
}



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const AuthenticatedRoute = ({ component: Component, ...rest }) => {
      return (
        <Route {...rest} render={(props) => {
          return (
            isUserAuthenticated() === true
              ? <Component {...props} />
              : <Redirect to='/logout' />
          )
        }} />
      )
    }

    return (
      <React.Fragment>
        <Router>
          <Switch>
            {
              routes.map((route, idx) =>
                route.ispublic ?
                  <Route path={route.path} component={route.component} key={idx} exact={route.exact === true}/>
                  :
                  <AuthenticatedRoute path={route.path} component={layoutWithSidebarAndHeader(route.component)} key={idx}/>
              )
            }
            <Route path="*" component={PageNotFound} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}


export default withRouter(App);