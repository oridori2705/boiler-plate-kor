import axios from "axios";
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from "./types";
//LoginPage에서 받은 이메일과 아이디를 server측 login부분으로 보낸다. 보낸데이터를 검사하고 다시 response.data로 받는다. <-action에서 할 일
export function loginUser(dataToSubmit) {
    const request=axios.post("/api/users/login",dataToSubmit).then(response=>response.data)
    //받은 response를 type을 임의로 만들어 지정하고 반환한다.
    //타입을 정한 이유는 Login액션이 있고 Register액션이 있고... 등등 많은 액션이 있는데 그걸 구분해서 Reducers로 보내줘야한다.
    return{ //지정된 reducer로 보내준다.
        type : LOGIN_USER,
        payload: request
    }
}
//Register부분
export function registerUser(dataToSubmit) {
    const request=axios.post("/api/users/register",dataToSubmit).then(response=>response.data)
    return{ //지정된 reducer로 보내준다.
        type : REGISTER_USER,
        payload: request
    }
}


export function auth() {
    const request=axios.get("/api/users/auth").then(response=>response.data) //Post가 아닌 get임
    return{ //지정된 reducer로 보내준다.
        type : AUTH_USER,
        payload: request
    }
}