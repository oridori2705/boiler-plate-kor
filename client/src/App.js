import {BrowserRouter,Route,Routes,} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'

import Auth from "./hoc/auth"
//null->아무나 출입이 가능한 페이지
//false -> 로그인한 유저는출입이 불가능한 페이지
//true -> 로그인한 유저만 출입이 가능한 페이지

  
  
function App() {
  const NewLandingPage=Auth(LandingPage,null);
  const NewLoginPage=Auth(LoginPage,false);
  const NewRegisterPage=Auth(RegisterPage,false);
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element = {<NewLandingPage/>}/>
      <Route path="/login" element = {<NewLoginPage/>}/>
      <Route path="/register" element = {<NewRegisterPage/>}/>
    </Routes>
    </BrowserRouter>
  );
  
}
export default App;