import React, {Component} from 'react';
import {Link} from 'react-router';
import {PageSection, Nav, Logo} from 'components';
import scrollToTop from 'helpers/scrollToTop';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

@scrollToTop()
export default class Signin extends Component {
  render() {
    const title = 'Pricing ⟡ Privacy ⟡ Entire.Life';
    const description = 'Your life is not for sale. Entire.Life will never advertise nor require you to pay. Get started with your own life calendar today.';
    return (
      <PageSection type="sunset-blocked" styleInner={{display: 'block'}} className={styles.global.container}>
        <DocumentMeta {...metaData(title, description)} extend />
        <Nav>
          <Logo type="black" style={{float: 'left'}}/>
          <h1 className={styles.global.brand}>Your life is not for sale !</h1>
        </Nav>
        <div style={{clear: 'both', marginBottom: '3em'}}>
          <p>
            A life calendar is a fantastic way to remember and plan your
            life. It ends up holding all sorts of personal information.
            We <em>could</em> sell that personal information to advertisers,
            and deliver targeted ads to you.
          </p>
          <p>But we hate that.</p>
          <p>So we're hoping to find a better way.</p>
          <p>
            The base calendar functionality is provided for free.
          </p>
          <p>
            At some point, we will offer social media integrations and
            add-ons. These will cost some small amount of money per-year.
          </p>
          <div className={styles.global.centered}>
            <Link to="/signin" className={styles.global.button}>
              Claim my free life calendar now
            </Link>
          </div>
        </div>
      </PageSection>
    );
  }
}
