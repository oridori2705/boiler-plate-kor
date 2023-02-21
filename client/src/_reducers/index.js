import { combineReducers } from "redux";
import user from "./user_Reducer";

//dispatch로 action을 수행하면 여기 store로  오게 된다.
const rootReducer =combineReducers({
    user
})

export default rootReducer;