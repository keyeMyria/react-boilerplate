import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import timesReducer from './times';
import usersReducer from './users';

export default combineReducers({
  router: routerReducer,
  auth: authReducer,
  times: timesReducer,
  users: usersReducer
});