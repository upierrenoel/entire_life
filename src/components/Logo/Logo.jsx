import React from 'react';
import {IndexLink} from 'react-router';
import config from '../../config';
import styles from './Logo.scss';

const Logo = ({type, style}) => {
  return (
    <IndexLink to="/" className={styles.wrappingLink} style={{...style, height: 59}}>
      <img
        src={require(`./${type}.svg`)}
        alt={config.app.title}
        className={styles[type]}
      />
    </IndexLink>
  );
};

Logo.propTypes = {
  type: React.PropTypes.oneOf(
    ['white', 'black', 'a-life']
  ).isRequired,
  style: React.PropTypes.object,
};

export default Logo;
