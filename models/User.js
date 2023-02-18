const mongoose=require('mongoose');
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

//스키마를 모델로 감싸줘야한다.
const User = mongoose.model('User',userSchema);

//모듈을 다른곳에서 쓸 수 있도록 export
module.exports={User};
