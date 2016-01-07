import React, {Component} from 'react';
import {Link} from 'react-router';
import {Landing} from 'components';
import scrollToTop from 'helpers/scrollToTop';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

@scrollToTop()
export default class Signin extends Component {
  state = {
    loading: false
  }

  render() {
    const title = 'Sign Up ⟡ Sign In ⟡ Entire.Life';
    return (
      <Landing>
        <DocumentMeta {...metaData(title)} extend />
        <div className={[
          styles.global.container, styles.global.lightLinks
        ].join(' ')}>
          <small>
            To get started with your life calendar, you'll need to sign up
            for an account, which is as quick &amp; easy as signing in with
            Google. Don't worry, we celebrate privacy and will never sell
            your <nobr>data –</nobr> <Link to="/pricing">more info</Link>
          </small>
        </div>
        {this.state.loading
          ? <img src={require('../../../static/icon-loading-spinner.gif')} width="50px" height="50px" alt="loading" style={{margin: '0 auto'}}/>
          : <div id="signin" ref="signin"/>
        }
      </Landing>
    );
  }
}
