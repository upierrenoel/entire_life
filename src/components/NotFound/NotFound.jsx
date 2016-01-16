import React from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {Link} from 'react-router';
import { Nav, Logo, PageSection, Footer } from 'components';

// const renderCalendarLink = () => {
//   const user = LoginStore.getState().user;
//   if(!user.slug) return null;
//   else return (
//     <span> or <Link to={user.slug}>go to your own calendar</Link></span>
//   )
// }

export default () => {
  const title = 'Not Found ⟡ Entire.Life';
  return (
    <div>
      <DocumentMeta {...metaData(title)} extend />
      <PageSection type="sunset" style={{textAlign: 'center'}}>
        <Nav>
          <Logo type="white" style={{float: 'left'}}/>
        </Nav>
        <h1 className="container">
          <div className="brand">4 0 4</div>
          <div>Not Found</div>
        </h1>
        <div className={`$"container" $"lightLinks"`}>
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
