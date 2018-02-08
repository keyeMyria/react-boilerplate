import axios from 'axios';
import { SERVER_URL } from '../constants';
import { AuthManager } from '../utils';
import {
  USERS_FETCH_REQUEST,
  USERS_FETCH_SUCCESS,
  USERS_FETCH_ERROR,
  USERS_ADD_REQUEST,
  USERS_ADD_SUCCESS,
  USERS_ADD_ERROR,
  USERS_UPDATE_REQUEST,
  USERS_UPDATE_SUCCESS,
  USERS_UPDATE_ERROR,
  USERS_REMOVE_REQUEST,
  USERS_REMOVE_SUCCESS,
  USERS_REMOVE_ERROR
} from '../actionTypes';

export const fetchUsers = () => async dispatch => {
  try {
    dispatch({ type: USERS_FETCH_REQUEST });

    const url = `${SERVER_URL}/users`;

    const { data } = await axios({
      method: 'GET',
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      }
    });

    dispatch({ type: USERS_FETCH_SUCCESS, data });
  } catch(error) {
    dispatch({ type: USERS_FETCH_ERROR, error: error.response.data });
  }
}

export const addUser = (time) => async dispatch => {
  try {
    dispatch({ type: USERS_ADD_REQUEST });

    const url = `${SERVER_URL}/users/register`;

    const { data } = await axios({
      method: 'POST',
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      },
      data: time
    });

    dispatch({ type: USERS_ADD_SUCCESS, data });
    await dispatch(fetchUsers());
  } catch(error) {
    dispatch({ type: USERS_ADD_ERROR, error: error.response.data });
  }
}

export const updateUser = (time, index) => async dispatch => {
  try {
    dispatch({ type: USERS_UPDATE_REQUEST });

    const url = `${SERVER_URL}/users/${index}`;

    const { data } = await axios({
      method: 'PUT',
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      },
      data: time
    });

    dispatch({ type: USERS_UPDATE_SUCCESS, data });
    await dispatch(fetchUsers());
  } catch(error) {
    dispatch({ type: USERS_UPDATE_ERROR, error: error.response.data });
  }
}

export const removeUser = (index) => async dispatch => {
  try {
    dispatch({ type: USERS_REMOVE_REQUEST });

    const url = `${SERVER_URL}/users/${index}`;

    const { data } = await axios({
      method: 'DELETE',
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      }
    });

    dispatch({ type: USERS_REMOVE_SUCCESS, data });
    await dispatch(fetchUsers());
  } catch(error) {
    dispatch({ type: USERS_REMOVE_ERROR, error: error.response.data });
  }
}
