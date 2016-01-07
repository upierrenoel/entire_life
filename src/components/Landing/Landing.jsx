import React from 'react';
import {Nav, Logo, PageSection} from 'components';
import styleImporter from 'helpers/styleImporter';

const styles = styleImporter(require('./Landing.scss'));

export default ({children}) => {
  return (
    <PageSection type="sunset" style={{textAlign: 'center'}}>
      <Nav>
        <Logo type="white" style={{float: 'left'}}/>
      </Nav>
      <h1>
        <div className={styles.global.container}>
          <div className={styles.global.brand}>Plan. Remember.</div>
          <div style={{fontSize: '.7em'}}>Live a Meaningful Life.</div>
        </div>
      </h1>
      {children}
      <div className={styles.local.screenshots}>
        <img src={require('./screenshots.png')} alt="Entire.Life works on all devices"/>
      </div>
    </PageSection>
  );
};
