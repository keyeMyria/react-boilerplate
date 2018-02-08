import axios from 'axios';
import { SERVER_URL } from '../constants';
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

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const url = `${SERVER_URL}/authenticate`;

    let formData = {};
    formData.email = email;
    formData.password = password;

    const { data } = await axios({
      method: 'POST',
      url,
      data: formData
    });

    dispatch({ type: LOGIN_SUCCESS, data });
    await dispatch(fetchProfile(data.access_token));
  } catch(error) {
    dispatch({ type: LOGIN_ERROR, error });
  }
}

export const signup = ({name, email, password}) => async dispatch => {
  try {
    dispatch({ type: SIGNUP_REQUEST });

    const url = `${SERVER_URL}/users`;

    let formData = {};
    formData.name = name;
    formData.email = email;
    formData.password = password;

    const { data } = await axios({
      method: 'POST',
      url,
      data: formData
    });

    dispatch({ type: SIGNUP_SUCCESS, data });
  } catch(error) {
    dispatch({ type: SIGNUP_ERROR, error });
  }
}

export const loginWithRefreshToken = refreshToken => async dispatch => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const url = `${SERVER_URL}/authenticate`;

    const formData = new FormData();
    formData.append('grant_type', 'refresh_token');
    formData.append('refresh_token', refreshToken);

    const { data } = await axios({
      method: 'POST',
      url,
      data: formData
    });

    dispatch({ type: LOGIN_SUCCESS, data });
    await dispatch(fetchProfile(data.access_token));
  } catch(error) {
    dispatch({ type: LOGIN_ERROR, error });
  }
}

export const fetchProfile = token => async dispatch => {
  try {
    dispatch({ type: FETCH_PROFILE_REQUEST });

    const url = `${SERVER_URL}/users/profile`;
    const bearerToken = `Bearer ${token}`;
    const { data } = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': bearerToken
      }
    });
    dispatch({ type: FETCH_PROFILE_SUCCESS, data: data });
  } catch(error) {
    dispatch({ type: FETCH_PROFILE_ERROR, error });
  }
}

export const autoLogin = () => dispatch => {
  if (AuthManager.isAuthenticated()) {
    dispatch(fetchProfile(AuthManager.getAccessToken()));
  // } else if (AuthManager.getRefreshToken()) {
  //   dispatch(loginWithRefreshToken(AuthManager.getRefreshToken()));
  } else {
    dispatch({ type: AUTO_LOGIN_ERROR });
  }
}

export const logout = () => dispatch => {
  AuthManager.clearAuthentication();
  dispatch({ type: LOGOUT });
}