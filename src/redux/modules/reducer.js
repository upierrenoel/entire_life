import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import events from './events';
import user from './user';
// import {reducer as form} from 'redux-form';

export default combineReducers({
  router: routerStateReducer,
  user,
  events
});
