import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {login} from 'redux/modules/auth';
import {Landing} from 'components';
import scrollToTop from 'helpers/scrollToTop';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

@connect(
  state => ({auth: state.auth}),
  dispatch => ({dispatch, pushState})
)
@scrollToTop()
export default class Signin extends Component {
  static propTypes = {
    auth: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  componentDidMount() {
    window.addEventListener('keyup', this.signin);
    this.renderSignin();
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.signin);
  }

  onSignIn = (googleUser) => {
    this.props.dispatch(login(googleUser));
  }

  signin = (e) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      this.refs.signin.firstChild.click();
    }
  }

  afterGoogleLoaded = (func) => {
    const waitForLoaded = setInterval(() => {
      if (window.gapi && window.gapi.auth2) {
        clearInterval(waitForLoaded);
        func();
      }
    }, 30);
  }

  renderSignin = () => {
    this.afterGoogleLoaded(() => {
      window.gapi.signin2.render('signin', {
        longtitle: true,
        width: 220,
        height: 50,
        onsuccess: this.onSignIn,
      });
    });
  }

  renderAction = () => {
    const {auth} = this.props;
    if (auth.loggingIn) {
      return (
        <img src={require('../../../static/icon-loading-spinner.gif')}
          width="50px" height="50px" alt="loading" style={{margin: '0 auto'}}/>
      );
    } else if (auth.user.slug) {
      return (
        <p className={styles.g.lightLinks}>You're signed in. You can&nbsp;
        <Link to={`/${auth.user.slug}`}>view your life calendar</Link>.</p>
      );
    }
    return (
      <div id="signin" ref="signin" style={{margin: '0 auto'}}/>
    );
  }

  render() {
    const title = 'Sign Up ⟡ Sign In ⟡ Entire.Life';
    return (
      <Landing>
        <DocumentMeta {...metaData(title)} extend />
        <div className={[
          styles.g.container, styles.g.lightLinks
        ].join(' ')}>
          <small>
            To get started with your life calendar, you'll need to sign up
            for an account, which is as quick &amp; easy as signing in with
            Google. Don't worry, we celebrate privacy and will never sell
            your <nobr>data –</nobr> <Link to="/pricing">more info</Link>
          </small>
        </div>
        {this.renderAction()}
      </Landing>
    );
  }
}
