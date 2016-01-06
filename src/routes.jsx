import React from 'react';
import {Route} from 'react-router';
// import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Home,
    Team,
    User,
    WeekDetail,
  } from 'containers';

// export default (store) => {
export default () => {
  // const requireLogin = (nextState, replaceState, cb) => {
  //   function checkAuth() {
  //     const { auth: { user }} = store.getState();
  //     if (!user) {
  //       // oops, not logged in, so can't be here!
  //       replaceState(null, '/');
  //     }
  //     cb();
  //   }
  //
  //   if (!isAuthLoaded(store.getState())) {
  //     store.dispatch(loadAuth()).then(checkAuth);
  //   } else {
  //     checkAuth();
  //   }
  // };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route component={App}>
      { /* Home (main) route */ }
      <Route path="/" component={Home}/>
      <Route path="team" component={Team}/>

      { /* Routes requiring login */ }
      {/* <Route onEnter={requireLogin}> */}
      {/*   <Route path="chat" component={Chat}/> */}
      {/*   <Route path="loginSuccess" component={LoginSuccess}/> */}
      {/* </Route> */}

      <Route path=":slug" component={User}>
        <Route path="week/:weekno" component={WeekDetail}/>
      </Route>
    </Route>
  );
};
