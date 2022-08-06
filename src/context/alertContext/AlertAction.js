// Reducer Actions
import { AlertTypes } from './AlertTypes';

export default class AlertAction {
  static SHOW_ALERT = 'SHOW_ALERT'; // The only action case we have

  // These functions here to atuo fill reducer dispatch action with
  // The type it allways SHOW_ALERT and the paload Type conected to method name
  // So it is SUCCESS in showSuccessAlert, we need only to set the message
  // TODO: create methods for info and warrning alert types
  static showSuccessAlert = (message) => {
    return {
      type: AlertAction.SHOW_ALERT,
      payload: { message, type: AlertTypes.SUCCESS },
    };
  };

  static showErrorAlert = (message) => {
    return {
      type: AlertAction.SHOW_ALERT,
      payload: { message, type: AlertTypes.ERROR },
    };
  };
}
