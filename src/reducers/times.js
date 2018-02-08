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

const initialState = {
  times: {
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
    case TIMES_FETCH_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case TIMES_FETCH_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        times: action.data
      }

    case TIMES_ADD_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case TIMES_ADD_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }

    case TIMES_UPDATE_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case TIMES_UPDATE_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }

    case TIMES_REMOVE_REQUEST:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case TIMES_REMOVE_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false
      }

    case TIMES_FETCH_ERROR:
    case TIMES_ADD_ERROR:
    case TIMES_UPDATE_ERROR:
    case TIMES_REMOVE_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };

    default:
      return state;
  }
}