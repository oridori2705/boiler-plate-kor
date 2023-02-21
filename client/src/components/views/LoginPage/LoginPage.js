import React,{useState} from 'react'

import { useDispatch } from 'react-redux';//useDispatch를 통해 값을 Reducer로 넘겨준다

import {loginUser} from "../../../_actions/user_action";

import { useNavigate } from 'react-router-dom';
function LoginPage() {

  let navigate = useNavigate();


  const dispatch= useDispatch();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  //이메일 value넣는 함수
  const OnEmailHandler=(event)=>{
    setEmail(event.currentTarget.value);
  }
  //패스워드 value넣는 함수
  const OnPasswordHandler=(e)=>{
    setPassword(e.currentTarget.value);
  }

  //Login버튼 클릭하면 리덕스에 값을 넘겨주는 함수
  const OnSubmitHandler=(e)=>{
    e.preventDefault();

    let body={
      email:Email,
      password:Password
    }

    //1. dispatch를 통해 값을 _actions/user_action으로 넘겨준다.
    //원래는 axios.post(/api~~~) 해서 body값을 보내주고 server의 index.js에서 login부분을 수행한다.
    //하지만 우리는 Redux를 추가해야하기 떄문에 Action을 하는 것이다. ->loginUser로 보낸다. 이메일과 아이디를
    dispatch(loginUser(body)).then(response=>{
      if(response.payload.loginSuccess){
        navigate('/');
      }else{
        alert("Error")
      }
    })

  }

  return (
    <div style={{display : "flex", justifyContent : "center", alignItems : "center", width : "100%", height: "100vh"}}>
      <form style={{display : "flex", flexDirection:"column"}} onSubmit={OnSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={OnEmailHandler}/>
        <label>password</label>
        <input type="password" value={Password} onChange={OnPasswordHandler}/>
        <br/>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginPage