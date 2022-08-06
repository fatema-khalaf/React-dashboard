import { createContext, useReducer } from 'react';
import { AlertTypes } from './AlertTypes';
import AlertReducer from './AlertReducer';

const initialState = {
  alertShower: {
    type: AlertTypes.NONE,
    message: '',
  },
};

export const AlertContext = createContext(initialState);

export const AlertProvider = ({ children }) => {
  // This hook allways takes two parameters the first one is the reducer function
  // and the secon is the initial state
  const [state, dispatch] = useReducer(AlertReducer, initialState);

  const value = [state, dispatch]; // Value is a reserved word for use context hook

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
