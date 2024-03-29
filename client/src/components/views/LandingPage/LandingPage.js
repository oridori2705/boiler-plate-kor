import React,{useEffect} from 'react'
import axios from  'axios';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  useEffect(() => {
    
    axios.get('/api/hello').then(response=>{console.log(response)});
   
  }, [])
  
  let navigate = useNavigate();

  const onClickHandler=()=>{
    axios.get("/api/users/logout").then(response=>{
      if(response.data.success){
        navigate("/login")
      }else{
        alert("로그아웃에 실패 했습니다.")
      }
    })
  }

   return (
    <div style={{display : "flex", justifyContent : "center", alignItems : "center", width : "100%", height: "100vh"}} /*vh는 뷰포트기준 */> 
      <h2>메인페이지</h2>
      <div>
        <button onClick={onClickHandler}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default LandingPage