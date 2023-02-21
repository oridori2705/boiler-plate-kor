import { useEffect } from "react";
import {useDispatch} from "react-redux";
import {auth} from '../_actions/user_action'; //리덕스 action 가져옴


import { useNavigate } from 'react-router-dom';

export default function(SpecificComponent,option,adminRoute=null) {

    function AuthenticationCheck(props){
        let navigate = useNavigate();
        const dispatch=useDispatch();
        useEffect(() => {
            //리덕스를 이용해서 action에서 axios 수행
            dispatch(auth()).then(response => {
                console.log(response);
                //로그인하지않은 상태
                if(!response.payload.isAuth){ //로그인이 되어있지않다면
                    if(option){ //로그인하지않은 사람이 true상태인 컴포넌트에 들어가려고하면
                        navigate('/login')
                    }
                }else{
                    //로그인한 상태
                    if(adminRoute&&!response.payload.isAdmin){ //관리자가 false인데 관리자페이지에 들어가려고하면
                        navigate("/")
                    }else{
                        if(option==false){ //로그인한 유저가 출입불가능한 페이지(false상태의 컴포넌트 로그인페이지나 회원가입페이지)
                            navigate("/");
                        }
                    }
                }
            })

        }, [])
        return(
            <SpecificComponent/> //반환해줘야 빈화면이 뜨지 않음
        )
    }

    return AuthenticationCheck
 
}
