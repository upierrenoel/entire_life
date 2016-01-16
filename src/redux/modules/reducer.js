import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

import auth from './auth';
import users from './users';
import events from './events';
import winsize from './winsize';
import {reducer as form} from 'redux-form';

export default combineReducers({
  router: routerStateReducer,
  form,
  auth,
  users,
  events,
  winsize,
});
