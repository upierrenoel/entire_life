import React from 'react';
import placeholder from './placeholder.jpeg';
import styles from './Avatar.scss';

class Avatar extends React.Component {
  render() {
    return (
      <span className={styles.avatar}
        style={{backgroundImage: `url(${this.props.user.imageUrl}), url(${placeholder})`}}>
        You
      </span>
    );
  }
}

Avatar.propTypes = {
  user: React.PropTypes.shape({
    imageUrl: React.PropTypes.string,
  }).isRequired,
};

export default Avatar;
