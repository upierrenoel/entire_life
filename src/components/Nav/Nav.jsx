import React from 'react';
import {Link} from 'react-router';
import styleImporter from 'helpers/styleImporter';

const styles = styleImporter(require('./Nav.scss'));

const headerItems = () => {
  return (
    <Link to={"/signin"} className={styles.global.button}>
      Sign In
    </Link>
  );
};

export default ({children}) => {
  return (
    <nav className={styles.local.wrap}>
      <div className={styles.local.items}>
        {headerItems()}
      </div>
      {children}
    </nav>
  );
};
