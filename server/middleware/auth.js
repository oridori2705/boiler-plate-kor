const {User}= require("../models/User");


let auth=(req,res,next)=>{
    //인증처리하는곳

    //1.클라이언트 쿠키에서 토큰을 가져온다.
    let token=req.cookies.x_auth; //저장되어있는 x_auth쿠키를 가져온다.

    //2.토큰을 복호화 한후 유저를 찾는다.
    User.findByToken(token,(err,user)=>{
        if(err) throw err; //에러나올때
        if(!user) return res.json({isAuth: false, err: true}); //해당하는 유저가 없을 때
        
        //토큰인증확인된 유저의 정보를 넣고 index.js에 보냄
        req.token=token;
        req.user=user;
        next();
    })
}

module.exports = {auth};