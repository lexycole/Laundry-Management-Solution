import { combineReducers } from 'redux';
import SplashReducer from './SplashReducer.js';
import LoginReducer from './LoginReducer.js';
import HomeReducer from './HomeReducer.js';
import ProfileReducer from './ProfileReducer.js';
import ForgotReducer from './ForgotReducer.js';
import ResetReducer from './ResetReducer.js';
import MyOrdersReducer from './MyOrdersReducer.js';
const allReducers = combineReducers({
  splash: SplashReducer,
  login:LoginReducer,
  home:HomeReducer,
  profile:ProfileReducer,
  forgot:ForgotReducer,
  reset:ResetReducer,
  myorder:MyOrdersReducer,
});
export default allReducers;