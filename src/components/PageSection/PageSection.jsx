import React from 'react';

const PageSection = ({type, children, style}) => {
  const styles = require('./PageSection.scss');

  return (
    <div className={styles[type]} style={style}>
      <div className={styles[`${type}-inner`]}>
        {children}
      </div>
    </div>
  );
};

PageSection.propTypes = {
  type: React.PropTypes.oneOf(['sunset', 'light', 'dark']).isRequired,
  children: React.PropTypes.node,
  style: React.PropTypes.object,
};

export default PageSection;
