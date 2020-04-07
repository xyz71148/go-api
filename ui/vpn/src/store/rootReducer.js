import { combineReducers } from "redux";
import instance from "./instanceReducer";
import app from "./appReducer";

export default combineReducers({
  instance,
  app
});
