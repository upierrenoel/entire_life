import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import events from './events';
import users from './users';
// import {reducer as form} from 'redux-form';

export default combineReducers({
  router: routerStateReducer,
  users,
  events
});
