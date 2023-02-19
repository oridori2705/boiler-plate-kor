const mongoose=require('mongoose');

const bcrypt =require("bcrypt");//비밀번호 암호화 설정 : bcrypt를 가져온다.
const saltRounds=10;

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
    }
    
    

})

//스키마를 모델로 감싸줘야한다.
const User = mongoose.model('User',userSchema);

//모듈을 다른곳에서 쓸 수 있도록 export
module.exports={User};
