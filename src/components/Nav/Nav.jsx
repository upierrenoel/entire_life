import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {SignedInNav} from 'components';
const styles = require('./Nav.scss');

@connect(
  state => ({auth: state.auth})
)
export default class Nav extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    lower: PropTypes.bool,
    auth: PropTypes.object,
    startTour: PropTypes.func,
  }

  headerItems = () => {
    const {auth} = this.props;
    if (!auth.user || !auth.user.slug) {
      return (
        <Link to={"/signin"} className="button">
          Sign In
        </Link>
      );
    }
    return <SignedInNav user={auth.user} startTour={this.props.startTour}/>;
  }

  render() {
    const {children, className, lower} = this.props;
    const localStyles = {};
    if (lower) localStyles.top = '1.5em';
    return (
      <nav className={[styles.wrap, className].join(' ')}>
        <div className={styles.items} style={localStyles}>
          {this.headerItems()}
        </div>
        {children}
      </nav>
    );
  }
}
