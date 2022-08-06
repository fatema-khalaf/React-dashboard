import AlertAction from './AlertAction';

// The reducer function it allways takes two parameters the last state and the action
// when this function called it will update the last state of the reducer with action.payload values
const AlertReducer = (state, action) => {
  switch (action.type) {
    case AlertAction.SHOW_ALERT:
      return {
        ...state,
        alertShower: action.payload, // This will be {message, type}
      };
    default:
      return state;
  }
};

export default AlertReducer;
