import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isLoaded as isUserLoaded, load as loadUser } from 'redux/modules/users';
import { isLoaded as isEventsLoaded, load as loadEvents } from 'redux/modules/events';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';

function fetchData(getState, dispatch, location, params) {
  const promises = [];
  const slug = params.slug;

  if (!isUserLoaded(getState(), slug)) {
    promises.push(dispatch(loadUser(slug)));
  }
  if (!isEventsLoaded(getState(), slug)) {
    promises.push(dispatch(loadEvents({userSlug: slug})));
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => {
    return {
      user: state.users.data[state.router.params.slug],
      events: state.events.data[state.router.params.slug],
    };
  },
  dispatch => ({dispatch, pushState})
)
export default class User extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    pushState: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.user.id !== nextProps.user.id) {
      // navigated to new user
      // dispatch(loadUser())
      // dispatch(loadEvents())
      console.log('can we use dispatch? this is what it is: ', this.props.dispatch);
    }
  }

  render() {
    return (
      <div>
        Hey there
      </div>
    );
  }
}
