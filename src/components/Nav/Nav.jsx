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

export default ({children, className, lower}) => {
  const localStyles = {};
  if (lower) localStyles.top = '1.5em';
  return (
    <nav className={[styles.local.wrap, className].join(' ')}>
      <div className={styles.local.items} style={localStyles}>
        {headerItems()}
      </div>
      {children}
    </nav>
  );
};
