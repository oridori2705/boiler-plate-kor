import axios from "axios";
import {
    LOGIN_USER
} from "./types";
//LoginPage에서 받은 이메일과 아이디를 server측 login부분으로 보낸다. 보낸데이터를 검사하고 다시 response.data로 받는다. <-action에서 할 일
export function loginUser(dataToSubmit) {
    const request=axios.post("api/users/login",dataToSubmit).then(response=>response.data)
    //받은 response를 type을 임의로 만들어 지정하고 반환한다.
    //타입을 정한 이유는 Login액션이 있고 Register액션이 있고... 등등 많은 액션이 있는데 그걸 구분해서 Reducers로 보내줘야한다.
    return{ //지정된 reducer로 보내준다.
        type : LOGIN_USER,
        payload: request
    }
}
