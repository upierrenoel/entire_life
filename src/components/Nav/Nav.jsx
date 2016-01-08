import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {SignedInNav} from 'components';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter(require('./Nav.scss'));

@connect(
  state => ({auth: state.auth})
)
export default class Nav extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    lower: PropTypes.bool,
    auth: PropTypes.object,
  }

  headerItems = () => {
    const {auth} = this.props;
    if (!auth.user || !auth.user.slug) {
      return (
        <Link to={"/signin"} className={styles.global.button}>
          Sign In
        </Link>
      );
    }
    // return <SignedInNav user={auth.user} startTour={this.props.startTour}/>;
    return <SignedInNav user={auth.user}/>;
  }

  render() {
    const {children, className, lower} = this.props;
    const localStyles = {};
    if (lower) localStyles.top = '1.5em';
    return (
      <nav className={[styles.local.wrap, className].join(' ')}>
        <div className={styles.local.items} style={localStyles}>
          {this.headerItems()}
        </div>
        {children}
      </nav>
    );
  }
}
