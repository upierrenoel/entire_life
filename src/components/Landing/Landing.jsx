import React from 'react';
import {Nav, Logo, PageSection} from 'components';

const styles = require('./Landing.scss');

export default ({children}) => {
  return (
    <PageSection type="sunset" style={{textAlign: 'center'}}>
      <Nav>
        <Logo type="white" style={{float: 'left'}}/>
      </Nav>
      <h1>
        <div className="container">
          <div className="brand">Plan. Remember.</div>
          <div style={{fontSize: '.7em'}}>Live a Meaningful Life.</div>
        </div>
      </h1>
      {children}
      <div className={styles.screenshots}>
        <img src={require('./screenshots.png')} alt="Entire.Life works on all devices"/>
      </div>
    </PageSection>
  );
};
