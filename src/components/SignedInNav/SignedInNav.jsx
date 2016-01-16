import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {logout} from 'redux/modules/auth';
import {Link} from 'react-router';
import {Avatar} from 'components';
const styles = require('./SignedInNav.scss');

@connect(
  state => ({currentPath: state.router.location.pathname})
)
export default class SignedInNav extends Component {
  static propTypes = {
    currentPath: PropTypes.string.isRequired,
    user: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    startTour: PropTypes.func,
  }

  state = {
    showAccountDropdown: false,
    showHelpDropdown: false,
  }

  componentDidMount() {
    document.addEventListener('click', this.toggleDropdowns, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleDropdowns, false);
  }

  toggleAccountDropdown = (e) => {
    e.preventDefault();
    const show = !this.state.showAccountDropdown;
    setTimeout(() => {
      this.setState({showAccountDropdown: show});
    }, 20);
  }

  toggleDropdowns = (e) => {
    const [a, b] = [this.refs.accountDropdown, this.refs.accountLink];
    if ((a && a.contains(e.target)) || b.contains(e.target)) {
      this.setState({showAccountDropdown: true});
    } else {
      this.setState({showAccountDropdown: false});
    }

    const [c, d] = [this.refs.helpDropdown, this.refs.helpLink];
    if ((c && c.contains(e.target)) || (d && d.contains(e.target))) {
      this.setState({showHelpDropdown: true});
    } else {
      this.setState({showHelpDropdown: false});
    }
  }

  toggleHelpDropdown = (e) => {
    e.preventDefault();
    const show = !this.state.showHelpDropdown;
    setTimeout(() => {
      this.setState({showHelpDropdown: show});
    }, 20);
  }

  logout = (e) => {
    e.preventDefault();
    this.props.dispatch(logout());
  }

  renderHelpDropdown = () => {
    if (this.state.showHelpDropdown) {
      return (
        <div ref="helpDropdown" className={styles.dropdown}>
          <a href="#" onClick={this.props.startTour} className="button">Tour</a>
          <Link to="/quiz" className="button">Welcome Quiz</Link>
        </div>
      );
    }
  }

  renderAccountDropdown = () => {
    if (this.state.showAccountDropdown) {
      return (
        <div ref="accountDropdown" className={styles.dropdown}>
          <Link to={`/${this.props.user.slug}`} className="button" activeClassName="active">Your Life</Link>
          <Link to={"/account"} className="button" activeClassName="active">Settings</Link>
          <a href="" onClick={this.logout} className="button">Sign Out</a>
        </div>
      );
    }
  }

  renderHelp = () => {
    if (this.props.currentPath.match(this.props.user.slug)) {
      return (
        <div ref="helpLink" className={styles.accountLink}>
          <a href="#help" onClick={this.toggleHelpDropdown}
            className={styles.helpIcon}>?</a>
        </div>
      );
    }
  }

  render() {
    return (
      <nav ref="nav">
        <div ref="accountLink" className={styles.accountLink}>
          <Link className={styles.dropdownLink}
            to="/account" onClick={this.toggleAccountDropdown}>
            <Avatar user={this.props.user}/>
            <small className={styles.dropdownArrow}>&#x25bc;</small>
          </Link>
        </div>
        {this.renderAccountDropdown()}
        {this.renderHelp()}
        {this.renderHelpDropdown()}
      </nav>
    );
  }
}
