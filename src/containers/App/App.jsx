import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';
import {resize} from 'redux/modules/winsize';
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
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    // ensure correct isMobile display after first page load
    this.props.dispatch(resize());

    let timeOut = null;
    window.onresize = () => {
      if (timeOut !== null) clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        this.props.dispatch(resize());
      }, 200);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.currentUser.slug && nextProps.currentUser.slug) {
      // login
      this.props.history.pushState(null, this.loggedInRoute(nextProps));
    } else if (this.props.currentUser.slug && !nextProps.currentUser.slug) {
      // logout
      this.props.history.pushState(null, '/');
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
