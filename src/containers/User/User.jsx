import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {connect} from 'react-redux';
import {isLoaded as isUserLoaded, load as loadUser} from 'redux/modules/users';
import {isLoaded as isEventsLoaded, load as loadEvents} from 'redux/modules/events';
import {pushState} from 'redux-router';
import connectData from 'helpers/connectData';
import scrollToTop from 'helpers/scrollToTop';
import {Nav, Logo, NotFound, Calendar} from 'components';
import {tourCallbacks} from 'utils/tourSteps';
import spinner from '../../../static/icon-loading-spinner.gif';

let Joyride;

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
      location: state.router.location,
      currentUser: state.auth.user,
      canView: !!(state.auth.user.slug && state.auth.user.slug === state.router.params.slug),
    };
  },
  dispatch => ({dispatch, pushState})
)
@scrollToTop()
export default class User extends Component {
  static propTypes = {
    user: PropTypes.object,
    currentUser: PropTypes.object,
    isUserLoading: PropTypes.bool.isRequired,
    isEventsLoading: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    children: PropTypes.object,
    weekno: PropTypes.string,
    monthno: PropTypes.string,
    location: PropTypes.object,
    canView: PropTypes.bool,
    history: PropTypes.object,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  state = {
    steps: [],
    showTour: false,
  }

  componentDidMount() {
    // joyride calls 'window'; using componentDidMount to only render on client
    Joyride = require('react-joyride');
    this.setState({showTour: true}); // eslint-disable-line react/no-did-mount-set-state
  }

  addSteps = (steps, start) => {
    let _steps = steps;
    if (!Array.isArray(_steps)) _steps = [_steps];
    if (!_steps.length) return false;

    // can't render on server; need to wait for componentDidMount
    const waitForLoaded = setInterval(() => {
      if (this.refs.joyride) {
        clearInterval(waitForLoaded);
        const {joyride} = this.refs;

        this.setState(currentState => {
          currentState.steps = currentState.steps.concat(joyride.parseSteps(_steps));
          return currentState;
        }, () => {
          if (start) joyride.start();
        });
      }
    }, 30);
  }

  startTour = (e) => {
    if (e) e.preventDefault();
    this.refs.joyride.reset();
    this.refs.joyride.start(true);
  }

  endTour = () => {
    this.props.history.replaceState(null, this.props.location.pathname);
  }

  stepCallback = (step) => {
    if (tourCallbacks[step.selector]) {
      const {user, history} = this.props;
      tourCallbacks[step.selector](user, history);
    }
  }

  renderName = () => {
    if (!this.props.user || !this.props.user.name) {
      return <img src={spinner} alt="loading..." width="40"/>;
    }
    if (!this.props.canView) {
      const name = this.props.user.name.split(' ')[0];
      return `${name}'s life is ${name}'s business!`;
    }
    return this.props.user.name;
  }

  renderCalendar = () => {
    const {user} = this.props;
    if (!this.props.canView) {
      const name = user.name.split(' ')[0];
      return (
        <div className="containerWide" style={{clear: 'both'}}>
          <p>There are things we're not meant to know. Amongst them, the detail's of {name}'s life!</p>
          {!!this.props.currentUser.slug ||
            <p>If this is your calendar, <Link to="/signin">sign in again</Link> to see it.</p>
          }
        </div>
      );
    }
    if (this.props.isUserLoading || this.props.isEventsLoading) {
      return (
        <p style={{clear: 'both', textAlign: 'center', paddingTop: '5em'}}>
          <img src={spinner} alt="loading..." width="100"/>
        </p>
      );
    }
    return (
      <Calendar addSteps={this.addSteps}
        startTour={this.startTour}
        showTour={!!this.props.location.query.tour}
        user={this.props.user}
        slug={this.props.user.slug}
        detail={this.props.children} weekno={this.props.weekno}
        monthno={this.props.monthno}
      />
    );
  }

  renderJoyride() {
    if (this.state.showTour) {
      return (
        <Joyride ref="joyride" steps={this.state.steps} type="guided"
          locale={{back: 'Back', close: 'Close', last: 'Okay!', next: 'Next', skip: 'Skip'}}
          completeCallback={this.endTour} showSkipButton stepCallback={this.stepCallback}
        />
      );
    }
  }

  render() {
    if (!this.props.user && !this.props.isUserLoading) return <NotFound/>;

    const title = `${this.renderName()} ⟡ A Life`;
    const description = `${this.renderName()} is using Entire.Life to document the past and live into a more beautiful future. Free symbolic life calendars for all who wish to join in!`;
    return (
      <div>
        <DocumentMeta {...metaData(title, description)} extend />
        {this.renderJoyride()}
        <Nav startTour={this.startTour} className="containerWide" lower>
          <Logo type="a-life" style={{float: 'left', padding: '1.4em 1em 0 0'}}/>
          <h1 className="brand">
           {this.renderName()}
          </h1>
        </Nav>
        {this.renderCalendar()}
      </div>
    );
  }
}
