import {
    LOGIN_USER,
    REGISTER_USER
} from "../_actions/types";

//Reducer는 (previousState,action) => nextState, 즉 이전의 state와 action을 받은 다음 state를 만들어내는 것이다.
//state={} 빈값으로 해야 된다. 이는 원래 초기 정보를 넣어줘야하는게 더 바람직한데 지금은 빈 객체를 넣어줬다.
//action을 수행하고 반환된 값을 Type을 구분해서 값을 반환한다 -> 반환된 값은 store로 가게된다.
export default function(state={},action){
    switch(action.type){
        case LOGIN_USER:
            return {...state, loginSuccessed : action.payload};
        case REGISTER_USER:
            return {...state, RegisterSuccessed : action.payload};
        default:
            return state; //안해주면 오류가 발생한다.
    }
}