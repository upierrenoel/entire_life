import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {logout} from 'redux/modules/auth';
import {Link} from 'react-router';
import {Avatar} from 'components';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter(require('./SignedInNav.scss'));

@connect()
export default class SignedInNav extends Component {
  static propTypes = {
    user: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    // startTour: PropTypes.func,
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
        <div ref="helpDropdown" className={styles.l.dropdown}>
          {/* <a href="#" onClick={this.props.startTour} className={styles.g.button}>Tour</a> */}
          <Link to="/quiz" className={styles.g.button}>Welcome Quiz</Link>
        </div>
      );
    }
  }

  renderAccountDropdown = () => {
    if (this.state.showAccountDropdown) {
      return (
        <div ref="accountDropdown" className={styles.l.dropdown}>
          <Link to={`/${this.props.user.slug}`} className={styles.g.button} activeClassName={styles.g.active}>Your Life</Link>
          <Link to={"/account"} className={styles.g.button} activeClassName={styles.g.active}>Settings</Link>
          <a href="" onClick={this.logout} className={styles.g.button}>Sign Out</a>
        </div>
      );
    }
  }

  renderHelp = () => {
    if (window.location.pathname.match(this.props.user.slug)) {
      return (
        <div ref="helpLink" className={styles.l.accountLink}>
          <a href="#help" onClick={this.toggleHelpDropdown}
            className={styles.l.helpIcon}>?</a>
        </div>
      );
    }
  }

  render() {
    return (
      <nav ref="nav">
        <div ref="accountLink" className={styles.l.accountLink}>
          <Link className={styles.l.dropdownLink}
            to="/account" onClick={this.toggleAccountDropdown}>
            <Avatar user={this.props.user}/>
            <small className={styles.l.dropdownArrow}>&#x25bc;</small>
          </Link>
        </div>
        {this.renderAccountDropdown()}
        {this.renderHelp()}
        {this.renderHelpDropdown()}
      </nav>
    );
  }
}
