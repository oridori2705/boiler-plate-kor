const mongoose=require('mongoose');

const bcrypt =require("bcrypt");//비밀번호 암호화 설정 : bcrypt를 가져온다.
const saltRounds=10; //salt를 위한 saltRounds 생성

const jwt = require("jsonwebtoken")//다운받은 jsonwebtoken 가져옴



//스키마 생성
const userSchema = mongoose.Schema({
    name : { //이름 : 타입은 string , 크기는 50
        type : String,
        maxlength : 50
    },
    email : { // trim 은 만약에 공백이 있으면 없애준다, unique : 똑같은 이메일 못쓰도록
        type : String,
        trim: true,
        unique :1
    },
    password :{
        type :String,
        minlength: 5
    },
    lastname: {
        type : String,
        maxlength : 50
    },
    role:{ //유저가 관리자가 될 수 있고 일반유저일 수도 있으니까
        type : Number,
        default : 0
    },
    image : String, //사용자에 해당하는 이미지를 줄 수 있음
    token :{ //토큰을 이용해서 나중에 유효성을 관리
        type : String
    },
    tokenExp : { //토큰을 사용할 수 있는 유효기간
        type : Number
    }

})


//비밀번호 암호화 : 몽구스에서 가져온 메소드 pre("save") -> 유저정보를 저장하기 전에 무엇을 한다는 의미, next파라미터를 줘서 안의 함수가 끝나면 save로 넘어간다.
userSchema.pre("save",function(next){

    var user=this;//위의 userSchema를 가르킬수 있게 된다. 아래 hash에서 user.password를 하면 패스워드를 가져올 수 있다.
    //만약에 사용자가 비밀번호를 변경할 때가 아닌 이메일을 변경할 때,이름을 변경할 때 등 여러가지 상황이 있는데 이 상황에 변경할 때 새로 저장하는데 다시 비밀번호를 암호화하면 안된다.
    //그래서 비밀번호가 변경될 때만 비밀번호를 암호화해야한다.
    if(user.isModified("password")){ //비밀번호가 변경될때의 조건
       
        //salt를 이용해서 비밀번호를 암호화 -> 먼저 salt를 생성 ->saltRounds가 필요 -> 이게 10이면 10자리인 salt를 만들어서 salt를 만든다 -> 이를 이용해 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err);//err뜨면 err를 index.js에 보낸다.
        bcrypt.hash(user.password, salt, function(err, hash) {//암호화 부분
            if(err) return next(err);//err뜨면 err를 index.js에 보낸다.
            // Store hash in your password DB.
            user.password=hash;//hash를 만드는데 성공하면 user.password를 hash된 비밀번호로 바꿔준다.
            next();//index.js save로 넘어가는 명령어
            });
        });
    }else{ //비밀번호만 변경하지 않은경우도 만들어줘야한다.
        next()
    }
    
    

})


//loginRoute에서 같은 이메일을 찾은 DB의 정보와 비밀번호가 같은지 확인하는 부분
//comparePassword는 우리가 임의로 만든 함수 이름이므로 바꿔도됨 그대신 index.js에서 받는 명령어도 바꿔줘야함
//plainPassword는 맞는지 확인하는 비밀번호
userSchema.methods.comparePassword=function(plainPassword,cb){
    //plainPassword 1234567이고, 암호화된 비밀번호 : ~~~~~ 일 때 같은지 확인해야함
    //그러면 plainPassword를 암호화해서 db에 있는 암호화된 비밀번호와 같은지 확인해야한다.(복호화 안됨)
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){ //가져온 비밀번호와 DB의 비밀번호가 같은지 확인
        if(err) return cb(err);//cb는 콜백
        cb(null,isMatch);//비밀번호가 같으면 isMatch : true를 보냄
    })
}


//로그인을 성공하면 토큰을 생성하는 부분
userSchema.methods.generateToken=function(cb){
    //jsonwebtoken을 이용해서 token을 생성하기
    var user =this;
    //몽고DB에있는 _id를 가져온다
    var token=jwt.sign(user._id.toHexString(),'secretToken');//이 부분이 에러가 나옴->plain object가 나와야함 toHexstring으로 해결
    //user._id+"secretToken"=token; => 나중에 해석할때 secretToken을 넣으면 -> user._id가 나온다.(누구인지 알 수있음) secretToken은 기억해야함

    user.token=token;//user스키마에 있는 token에 저장
    user.save(function(err,user){
        if(err) return cb(err);

        cb(null,user); //토큰이 저장 잘 됐으면 그 user 정보를 전달한다.
    })
}

//---------------------------------Auth 인증 부분----------------------------------
//findByToken함수를 임의적으로 만듦
//1.token을 가져와서 복호화하고 토큰과 유저아이디를 통해 해당하는 유저를 가져온다.
//jwt.verify를 통해 token(user_id+"secretToken") 을 복호화해서 user._id부분만 decode라는 변수에 저장된다.
userSchema.statics.findByToken =function(token,cb){ //여기 token은 auth에서 가져온 클라이언트에 저장되어있는 token이다.
    var user=this;

    //토큰을 decode(복호화)한다.(JSONWEBTOKEN의 명령어)
    jwt.verify(token,"secretToken",function(err,decode){
        //유저아이디와 토큰을 이용해서 유저를 찾아 가져오고
        user.findOne({"_id" : decode,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);//해당 유저 정보 전달
        })
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    })
}





//스키마를 모델로 감싸줘야한다.
const User = mongoose.model('User',userSchema);

//모듈을 다른곳에서 쓸 수 있도록 export
module.exports={User};
