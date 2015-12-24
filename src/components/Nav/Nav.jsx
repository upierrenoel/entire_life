import React from 'react';
import {Link} from 'react-router';
import styles from './Nav.scss';

const headerItems = () => {
  return (
    <Link to={"/signin"} className={styles.button}>
      Sign In
    </Link>
  );
};

export default ({children}) => {
  return (
    <nav className={styles.wrap}>
      <div className={styles.items}>
        {headerItems()}
      </div>
      {children}
    </nav>
  );
};
