import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
// import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
// import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import {pushState} from 'redux-router';
// import connectData from 'helpers/connectData';
import config from '../../config';

// function fetchData(getState, dispatch) {
//   const promises = [];
//   if (!isInfoLoaded(getState())) {
//     promises.push(dispatch(loadInfo()));
//   }
//   if (!isAuthLoaded(getState())) {
//     promises.push(dispatch(loadAuth()));
//   }
//   return Promise.all(promises);
// }

// @connectData(fetchData)
@connect(
  // state => ({user: state.auth.user}),
  null,
  {pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    // user: PropTypes.object,
    // logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  // componentWillReceiveProps(nextProps) {
  //   if (!this.props.user && nextProps.user) {
  //     // login
  //     this.props.pushState(null, '/loginSuccess');
  //   } else if (this.props.user && !nextProps.user) {
  //     // logout
  //     this.props.pushState(null, '/');
  //   }
  // }

  // handleLogout = (event) => {
  //   event.preventDefault();
  //   this.props.logout();
  // }

  render() {
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <DocumentMeta {...config.app}/>
        {this.props.children}
      </div>
    );
  }
}
