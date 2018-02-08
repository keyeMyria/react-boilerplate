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

const initialState = {
  users: {
    "metadata": {
      "resultset": {
          "count": 0,
          "offset": 0,
          "limit": 10
      }
    },
    "results": []
  },
  isLoading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USERS_FETCH_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case USERS_FETCH_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        users: action.data
      }

    case USERS_ADD_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case USERS_ADD_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }

    case USERS_UPDATE_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case USERS_UPDATE_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }

    case USERS_REMOVE_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case USERS_REMOVE_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }

    case USERS_FETCH_ERROR:
    case USERS_ADD_ERROR:
    case USERS_UPDATE_ERROR:
    case USERS_REMOVE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };

    default:
      return state;
  }
}