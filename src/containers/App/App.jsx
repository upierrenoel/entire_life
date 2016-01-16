import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {pushState} from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';

require('../../theme/global.scss');

function fetchData(getState, dispatch) {
  const promises = [];
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({currentUser: state.auth.user}),
  {pushState}
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.currentUser.slug && nextProps.currentUser.slug) {
      // login
      this.props.pushState(null, this.loggedInRoute(nextProps));
    } else if (this.props.currentUser.slug && !nextProps.currentUser.slug) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  loggedInRoute = (nextProps) => {
    if (nextProps.currentUser.born) return `/${nextProps.currentUser.slug}`;
    return '/signing-up';
  }

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
