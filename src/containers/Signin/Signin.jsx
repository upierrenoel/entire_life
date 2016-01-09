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
const styles = styleImporter(require('./Signin.scss'));

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

  // Google's sign in logic, as of Jan 2016, has a bug. It assumes that, after
  // the button has been rendered on the page, we never remove its container
  // from the page. Never ever. And since we do, it tries to change the "Sign
  // in with Google" text to "Signed in with Google", but that text is no
  // longer on the screen, and it causes a JS error.
  //
  // To workaround this annoying error, we can wait 500ms to ensure that the
  // button is actually on the page, then clone the offending text elements and
  // put them in a hidden div at the end of the body tag.
  //
  // See http://stackoverflow.com/q/34688248/249801 for more info.
  circumventStupidGoogleBug = () => {
    setTimeout(() => {
      const signinText = document.querySelector('[id^=not_signed_in]');
      const signedinText = document.querySelector('[id^=connected]');
      if (signinText && signedinText) {
        const div = document.createElement('div');
        div.style.display = 'none';
        div.appendChild(signinText.cloneNode());
        div.appendChild(signedinText.cloneNode());
        document.body.appendChild(div);
      }
    }, 500);
  }

  renderSignin = () => {
    this.afterGoogleLoaded(() => {
      window.gapi.signin2.render('signin', {
        longtitle: true,
        width: 220,
        height: 50,
        onsuccess: this.onSignIn,
      });
      this.circumventStupidGoogleBug();
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
      <div id="signin" ref="signin" className={styles.l.signin}/>
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
