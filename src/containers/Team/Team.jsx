import React, {Component} from 'react';
import {Nav, Logo, PageSection, Footer} from 'components';
import scrollToTop from 'helpers/scrollToTop';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

@scrollToTop()
export default class Team extends Component {
  render() {
    const title = 'Team ⟡ Entire.Life';
    const description = 'The team behind Entire.Life wants to help you live a fuller, more intentional life.';
    return (
      <div>
        <DocumentMeta {...metaData(title, description)} extend />
        <PageSection type="sunset-blocked" className={styles.global.container}>
          <Nav lower>
            <Logo type="black" style={{float: 'left'}}/>
            <h1 className={styles.global.brand}>
              Team
            </h1>
          </Nav>
          <div className={[styles.global.row, styles.global.verticallyCentered].join(' ')} style={{marginTop: '4em'}}>
            <div className={[styles.global.col4, styles.global.centered].join(' ')}>
              <img src="https://secure.gravatar.com/avatar/259469ed60f945161a150e79a381b26c?s=400" className={styles.global.circle} alt="picture of Chad Ostrowski"/>
            </div>
            <div className={styles.global.col8}>
              <h2 className={styles.global.brand}>Chad Ostrowski</h2>
              Chad builds this thing. He currently lives in Philadelphia, PA, USA. What he wants to give others:
              <ul>
                <li>Wonder</li>
                <li>Perspective</li>
                <li>Power</li>
              </ul>
              <span><a href="https://www.instagram.com/_chadoh_/">Instagram</a> | <a href="http://chadoh.com/">Blog</a> | <a href="https://twitter.com/chadoh">Twitter</a> | <a href="https://entire.life/chadoh">Entire.Life</a></span>
            </div>
          </div>
          <div
            className={[styles.global.row, styles.global.reverse, styles.global.verticallyCentered].join(' ')}
            style={{marginTop: 30, marginBottom: '3em'}}>
            <div className={[styles.global.col4, styles.global.centered].join(' ')}>
              <img src="https://pbs.twimg.com/profile_images/433481660672139264/w1o6dzLj.jpeg" className={styles.global.circle} alt="picture of Uri Pierre-Noel"/>
            </div>
            <div className={styles.global.col8}>
              <h2 className={styles.global.brand}>Uri Pierre Noel</h2>
              Uri markets this thing. He currently lives in Boston, MA, USA. What he wants to give to others:
              <ul>
                <li>Happiness</li>
                <li>Beauty</li>
                <li>Inspiration</li>
              </ul>
              <span><a href="https://www.instagram.com/upierrenoel/">Instagram</a> | <a href="http://upierrenoel.tumblr.com/">Blog</a> | <a href="https://twitter.com/upierrenoel">Twitter</a> | <a href="https://entire.life/upierrenoel">Entire.Life</a></span>
            </div>
          </div>
        </PageSection>
        <Footer/>
      </div>
    );
  }
}
