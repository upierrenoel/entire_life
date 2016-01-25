import React from 'react';

const PageSection = ({type, children, style, styleInner, className}) => {
  const styles = require('./PageSection.scss');

  return (
    <div className={styles[type]} style={style}>
      <div className={[styles[`${type}-inner`], className].join(' ')} style={styleInner}>
        {children}
      </div>
    </div>
  );
};

PageSection.propTypes = {
  type: React.PropTypes.oneOf(['sunset', 'sunset-blocked', 'light', 'dark', 'white']).isRequired,
  children: React.PropTypes.node,
  style: React.PropTypes.object,
  className: React.PropTypes.string,
};

export default PageSection;
