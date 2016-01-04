import React from 'react';
import {Link} from 'react-router';
import { Nav, Logo, PageSection, Footer } from 'components';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

// const renderCalendarLink = () => {
//   const user = LoginStore.getState().user;
//   if(!user.slug) return null;
//   else return (
//     <span> or <Link to={user.slug}>go to your own calendar</Link></span>
//   )
// }

export default () => {
  return (
    <div>
      <PageSection type="sunset" style={{textAlign: 'center'}}>
        <Nav>
          <Logo type="white" style={{float: 'left'}}/>
        </Nav>
        <h1 className={styles.global.container}>
          <div className={styles.global.brand}>4 0 4</div>
          <div>Not Found</div>
        </h1>
        <div className={`${styles.global.container} ${styles.global.lightLinks}`}>
          <p>
            You've stumbled on a page that doesn't exist.
            You can <Link to="/">visit the home page</Link>
            {/* {renderCalendarLink()} */}
            .
          </p>
        </div>
        <p>No worries.</p>
      </PageSection>
      <Footer/>
    </div>
  );
};