import { AuthManager } from '../utils';
import {
  AUTO_LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
  LOGOUT
} from '../actionTypes';

const initialState = {
  user: null,
  autoLoggingIn: true,
  signedUp: false,
  isLoading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
    case FETCH_PROFILE_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case LOGIN_SUCCESS:
      AuthManager.saveAuthentication(action.data);
      return state;

    case SIGNUP_SUCCESS:
      return {
        ...state,
        signedUp:true,
        error:null,
        isLoading: false
      }

    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        autoLoggingIn: false,
        isLoading: false,
        user: action.data
      };

    case LOGIN_ERROR:
    case SIGNUP_ERROR:
    case FETCH_PROFILE_ERROR:
    case AUTO_LOGIN_ERROR:
      return {
        ...state,
        user: null,
        autoLoggingIn: false,
        isLoading: false,
        error: action.error
      };

    case LOGOUT:
      return {
        ...state,
        user: null
      };

    default:
      return state;
  }
}
