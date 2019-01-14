import { SET_INFO } from '../actions';

const initialState = {
  phrase: '',
};

export const gameInfoReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_INFO: {
    return {
      ...state,
      phrase: action.phrase,
    };
  }
  default:
    return state;
  }
};
