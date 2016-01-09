import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {connect} from 'react-redux';
import {isLoaded as isUserLoaded, load as loadUser} from 'redux/modules/users';
import {isLoaded as isEventsLoaded, load as loadEvents} from 'redux/modules/events';
import {pushState} from 'redux-router';
import connectData from 'helpers/connectData';
import scrollToTop from 'helpers/scrollToTop';
import {Nav, Logo, NotFound, Calendar} from 'components';
import spinner from '../../../static/icon-loading-spinner.gif';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

function fetchDataDeferred(getState, dispatch) {
  const promises = [];
  const slug = getState().router.params.slug;

  if (!isUserLoaded(getState(), slug)) {
    promises.push(dispatch(loadUser(slug)));
  }
  if (!isEventsLoaded(getState(), slug)) {
    promises.push(dispatch(loadEvents({userSlug: slug})));
  }
  return Promise.all(promises);
}

@connectData(null, fetchDataDeferred)
@connect(
  state => {
    return {
      user: state.users.data[state.router.params.slug],
      isUserLoading: !!state.users.loading,
      isEventsLoading: !!state.events.loading,
      weekno: state.router.params.weekno,
      monthno: state.router.params.monthno,
    };
  },
  dispatch => ({dispatch, pushState})
)
@scrollToTop()
export default class User extends Component {
  static propTypes = {
    user: PropTypes.object,
    isUserLoading: PropTypes.bool.isRequired,
    isEventsLoading: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    children: PropTypes.object,
    weekno: PropTypes.string,
    monthno: PropTypes.string,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.user && nextProps.user && this.props.user.id !== nextProps.user.id) {
      // navigated to new user
      // dispatch(loadUser())
      // dispatch(loadEvents())
      console.log('can we use dispatch? this is what it is: ', this.props.dispatch);
    }
  }

  renderName = () => {
    // if(!LoginStore.canView(this.props.user)) {
    //   const name = this.props.user.get('name').split(' ')[0]
    //   return `${name}'s life is ${name}'s business!`
    // }
    if (!this.props.user || !this.props.user.name) {
      return <img src={spinner} alt="loading..." width="40"/>;
    }
    return this.props.user.name;
  }

  renderCalendar = () => {
    // const user = this.props.user;
    // if(!LoginStore.canView(user)) {
    //   const name = user.get('name').split(' ')[0]
    //   return <div className="container-wide">
    //     <p>There are things we're not meant to know. Amongst them, the detail's of {name}'s life!</p>
    //     <p>If this is your calendar, <Link to="/signin">sign in again</Link> to see it.</p>
    //   </div>
    // }
    if (this.props.isUserLoading || this.props.isEventsLoading) {
      return (
        <p style={{clear: 'both', textAlign: 'center', paddingTop: '5em'}}>
          <img src={spinner} alt="loading..." width="100"/>
        </p>
      );
    }
    return (
      <Calendar
        user={this.props.user}
        slug={this.props.user.slug}
        detail={this.props.children} weekno={this.props.weekno}
        monthno={this.props.monthno}
      />
    );
  }

  render() {
    if (!this.props.user && !this.props.isUserLoading) return <NotFound/>;

    const title = `${this.renderName()} ⟡ A Life`;
    const description = `${this.renderName()} is using Entire.Life to document the past and live into a more beautiful future. Free symbolic life calendars for all who wish to join in!`;
    return (
      <div>
        <DocumentMeta {...metaData(title, description)} extend />
        {/* <Nav startTour={this.startTour}> */}
        <Nav className={styles.global.containerWide} lower>
          <Logo type="a-life" style={{float: 'left', padding: '1.4em 1em 0 0'}}/>
          <h1 className={styles.global.brand}>
           {this.renderName()}
          </h1>
        </Nav>
        {this.renderCalendar()}
      </div>
    );
  }
}
