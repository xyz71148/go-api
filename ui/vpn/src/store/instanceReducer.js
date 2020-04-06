import {
  FETCH_BEGIN,
  FETCH_SUCCESS,
  FETCH_FAILURE
} from "./instanceActions";

const initialState = {
  items: [],
  loading: false,
  error: null
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case FETCH_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.items
      };

    case FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };

    default:
      return state;
  }
}
