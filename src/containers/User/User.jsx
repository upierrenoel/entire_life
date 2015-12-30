import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isLoaded as isUserLoaded, load as loadUser } from 'redux/modules/users';
import { isLoaded as isEventsLoaded, load as loadEvents } from 'redux/modules/events';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import { Nav, Logo, NotFound } from 'components';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

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
    user: PropTypes.object,
    events: PropTypes.object,
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

  renderName = () => {
    // if(!LoginStore.canView(this.props.user)) {
    //   const name = this.props.user.get('name').split(' ')[0]
    //   return `${name}'s life is ${name}'s business!`
    // }
    return this.props.user.name;
  }

  render() {
    if (!this.props.user) return <NotFound/>;
    return (
      <div>
        {/* <Nav startTour={this.startTour}> */}
        <Nav className={styles.global.containerWide} lower>
          <Logo type="a-life" style={{float: 'left', padding: '1.4em 1em 0 0'}}/>
          <h1 className={styles.global.brand}>
            {this.renderName()}
          </h1>
        </Nav>
      </div>
    );
  }
}
