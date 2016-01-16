import React, {Component} from 'react';
import {Nav, Logo, PageSection, Footer} from 'components';
import scrollToTop from 'helpers/scrollToTop';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';

@scrollToTop()
export default class Team extends Component {
  render() {
    const title = 'Team ⟡ Entire.Life';
    const description = 'The team behind Entire.Life wants to help you live a fuller, more intentional life. Get started with your own life calendar today.';
    return (
      <div>
        <DocumentMeta {...metaData(title, description)} extend />
        <PageSection type="sunset-blocked" className="container">
          <Nav lower>
            <Logo type="black" style={{float: 'left'}}/>
            <h1 className="brand">
              Team
            </h1>
          </Nav>
          <div className="row verticallyCentered" style={{marginTop: '4em'}}>
            <div className="col4 centered">
              <img src="https://secure.gravatar.com/avatar/259469ed60f945161a150e79a381b26c?s=400" className="circle" alt="picture of Chad Ostrowski"/>
            </div>
            <div className="col8">
              <h2 className="brand">Chad Ostrowski</h2>
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
            className="row reverse verticallyCentered"
            style={{marginTop: 30, marginBottom: '3em'}}>
            <div className="col4 centered">
              <img src="http://www.gravatar.com/avatar/5fa2393daaadfe646f2986ddd4a981dc?s=500" className="circle" alt="picture of Uri Pierre-Noel"/>
            </div>
            <div className="col8">
              <h2 className="brand">Uri Pierre Noel</h2>
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
