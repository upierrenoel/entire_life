import React from 'react';
import {Link} from 'react-router';
import config from '../../config';
import styles from './Logo.scss';

const Logo = ({type, style}) => {
  return (
    <Link to="/" className={styles.wrappingLink} style={style}>
      <img
        src={require(`./${type}.svg`)}
        alt={config.app.title}
        className={styles[type]}
      />
    </Link>
  );
};

Logo.propTypes = {
  type: React.PropTypes.oneOf(
    ['white', 'black', 'a-life']
  ).isRequired,
  style: React.PropTypes.object,
};

export default Logo;
