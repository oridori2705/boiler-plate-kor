import React,{useState} from 'react'

import { useDispatch } from 'react-redux';
import {registerUser} from "../../../_actions/user_action";

import { useNavigate } from 'react-router-dom';
function RegisterPage() {
  let navigate = useNavigate();


  const dispatch= useDispatch();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [Confirm_password, setConfirm_password] = useState("")

  //이메일 value넣는 함수
  const OnEmailHandler=(event)=>{
    setEmail(event.currentTarget.value);
  }
  //패스워드 value넣는 함수
  const OnPasswordHandler=(e)=>{
    setPassword(e.currentTarget.value);
  }
  const OnNameHandler=(e)=>{
    setName(e.currentTarget.value);
  }
  const OnConfirmHandler=(e)=>{
    setConfirm_password(e.currentTarget.value);
  }

  //Register버튼 클릭하면 리덕스에 값을 넘겨주는 함수
  //원래는 Axios로 그냥 서버랑 통신하면됨 하지만 리덕스 이용
  const OnSubmitHandler=(e)=>{
    e.preventDefault();
    if(Password !== Confirm_password){
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다")
    }
    let body={
      email:Email,
      name:Name,
      password:Password,
    }

    
    dispatch(registerUser(body)).then(response=>{
      console.log(response.payload.RegisterSuccessed)
      if(response.payload.success){
        navigate('/login');
      }else{
        alert("Failed To Sign Up");
      }
    })

  }

  return (
    <div style={{display : "flex", justifyContent : "center", alignItems : "center", width : "100%", height: "100vh"}}>
      <form style={{display : "flex", flexDirection:"column"}} onSubmit={OnSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={OnEmailHandler}/>
        <label>Name</label>
        <input type="text" value={Name} onChange={OnNameHandler}/>
        <label>password</label>
        <input type="password" value={Password} onChange={OnPasswordHandler}/>
        <label>Confirm password</label>
        <input type="password" value={Confirm_password} onChange={OnConfirmHandler}/>
        <br/>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default RegisterPage