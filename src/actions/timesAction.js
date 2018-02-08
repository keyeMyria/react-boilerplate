import axios from 'axios';
import { SERVER_URL } from '../constants';
import { AuthManager } from '../utils';
import {
  TIMES_FETCH_REQUEST,
  TIMES_FETCH_SUCCESS,
  TIMES_FETCH_ERROR,
  TIMES_ADD_REQUEST,
  TIMES_ADD_SUCCESS,
  TIMES_ADD_ERROR,
  TIMES_UPDATE_REQUEST,
  TIMES_UPDATE_SUCCESS,
  TIMES_UPDATE_ERROR,
  TIMES_REMOVE_REQUEST,
  TIMES_REMOVE_SUCCESS,
  TIMES_REMOVE_ERROR
} from '../actionTypes';

export const fetchTimes = ({startDate, endDate}) => async dispatch => {
  try {
    dispatch({ type: TIMES_FETCH_REQUEST });

    const url = `${SERVER_URL}/times`;

    const { data } = await axios({
      method: 'GET',
      params: {
        startDate: startDate,
        endDate: endDate
      },
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      }
    });

    dispatch({ type: TIMES_FETCH_SUCCESS, data });
  } catch(error) {
    dispatch({ type: TIMES_FETCH_ERROR, error: error.response.data });
  }
}

export const addTime = (time) => async dispatch => {
  try {
    dispatch({ type: TIMES_ADD_REQUEST });

    const url = `${SERVER_URL}/times`;

    const { data } = await axios({
      method: 'POST',
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      },
      data: time
    });

    dispatch({ type: TIMES_ADD_SUCCESS, data });
    await dispatch(fetchTimes());
  } catch(error) {
    dispatch({ type: TIMES_ADD_ERROR, error: error.response.data });
  }
}

export const updateTime = (time, index) => async dispatch => {
  try {
    dispatch({ type: TIMES_UPDATE_REQUEST });

    const url = `${SERVER_URL}/times/${index}`;

    const { data } = await axios({
      method: 'PUT',
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      },
      data: time
    });

    dispatch({ type: TIMES_UPDATE_SUCCESS, data });
    await dispatch(fetchTimes());
  } catch(error) {
    dispatch({ type: TIMES_UPDATE_ERROR, error: error.response.data });
  }
}

export const removeTime = (index) => async dispatch => {
  try {
    dispatch({ type: TIMES_REMOVE_REQUEST });

    const url = `${SERVER_URL}/times/${index}`;

    const { data } = await axios({
      method: 'DELETE',
      url,
      headers: {
        'Authorization': AuthManager.getBearerToken()
      }
    });

    dispatch({ type: TIMES_REMOVE_SUCCESS, data });
    await dispatch(fetchTimes());
  } catch(error) {
    dispatch({ type: TIMES_REMOVE_ERROR, error: error.response.data });
  }
}
