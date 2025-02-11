/* eslint-disable @typescript-eslint/no-explicit-any */
const initialState = {
  user: null,
};

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'AUTHENTICATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
