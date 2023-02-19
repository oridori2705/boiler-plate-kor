const express = require('express'); //다운받은 express 모듈을 가져옴
const app = express();// 함수를 이용해 새로운 express 앱을 만듦
const port = 5000; //포트는 아무렇게해도됨

const bodyParser = require("body-parser"); //다운받은 body-parser을 가져옴
const {User}= require("./models/User") //스키마 가져옴 app.post하기위해


const config=require("./config/key"); //비밀설정 : mongoURL를 깃허브에 못올리게 하도록 key 파일에서 배포 후 환경인지, 로컬환경인지 구분하고 URI를 가져온다.

const cookieParser =require("cookie-parser");//토큰저장하기 :cookie-parser 가져오기


app.use(cookieParser());//cookie-parser 사용할 수 있음


//boy-parser는 클라이언트에서 보내는 정보를 분석해서 가져올 수 있게하는 것
//application/x-www-form-urlencoded 같은 형식의 데이터를 가져옴
app.use(bodyParser.urlencoded({extended:true}));
//application/json 같은 형식의 데이터를 가져옴
app.use(bodyParser.json());

//몽구스 모듈 가져오기
const mongoose =require('mongoose');
mongoose.set('strictQuery', true);
//몽구스 연결하기 -> 아이디 뒤에 <password> 부분  내 비밀번호로 바꿔서 넣기
mongoose.connect(config.mongoURI,{ //config.mongoURI : 비밀설정 : 위에서 구분한 변수를 가져온다.
    useNewUrlParser:true, useUnifiedTopology : true
}).then(()=>console.log("good")).catch(err=>console.log(err))

//root 디렉토리에 hello world를 출력되게 해줌
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//-------------------------------Register Route 부분-----------------------------------------------
//비밀번호 암호화:user.save를 하기전에 암호화를 해야한다. User.js에 있느 스키마에서 암호화 한다.

//회원 가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.-> 우리가 만든 User.js 이용
//req.body에는 객체 {id : 132 , password : 1456} 와 같은 정보들이 들어있다. ->이러한 정보가 들어있는 이유는 body-parser가 있기 때문이다.
app.post("/register",(req,res)=>{
  const user= new User(req.body);
  //몽고DB에서 오는 메소드, 정보들이 user모델에 저장
  user.save((err,userIfon)=>{ //저장할 때 오류가 있으면 클라이언트에 에러가 있다고 전달해야되는데 이를 json형식으로 성공하지 못했다고 err메세지와 함께 전달한다. 
    if(err) return res.json({success: false,err})
    return res.status(200).json({ //만약에 성공을 하면 성공했다고 전달한다. res.status(200)은 성공했다는 뜻임
      success:true
    })
  }); 
})


//----------------------------------login Route 부분---------------------------------------------
app.post('/login',(req,res)=>{
  //1.요청된 이메일을 데이터베이스에 있는지 찾는다.-------------------------------------------
  //User모델을 가져와서 findOne(몽고DB에서 제공하는 메소드)
  //찾고자하는 이메일을 email : req.body.email 넣는다.
  User.findOne({ email : req.body.email },(err,user)=>{
    if(!user){//만약에 User 콜렉션 안에 위 email을 가진 유저가 한명도 없다면 user는 없다고 뜬다.
      return res.json({ //이메일 찾기 실패시 json으로 보냄
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //2.있다면 비밀번호가 같은지 확인한다.-----------------------------------------------
    //user 변수 이 안에는 user의 이름 비밀번호 이메일 들이 있다.
    //거기에 임의로 만든 함수comparePassword를 실행한다.
    //하나는 req.body.password : 우리가 로그인할 때 보낸 password , 그리고 errd와 isMatch : DB에있는 비밀번호와 같은지 확인하는 변수 
    //이 함수는 User.js에서 만든다.
    user.comparePassword(req.body.password, (err,isMatch)=>{
      if(!isMatch) return res.json({loginSuccess : false,message:"비밀번호가 틀렸습니다."});//실패했을 때

      //3.비밀번호가 같다면 유저를 위한 token을 생성한다.----------------------------
      //generateToken은 임의로 만든 함수다. User.js에서 진행된다.
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);
        //token을 어디에 저장해야한다. ->( 쿠키 또는 로컬스토리지)
        //우리는 쿠키에 저장한다
        //이름이 x_auth인걸로  쿠키에 저장된다.
        res.cookie("x_auth",user.token)
        .status(200)//성공했다는표시
        .json({loginSuccess:true,userId:user._id});
      })
    })

  })
  
  
})



//port 3000에 이 앱을 실행하는 것이다.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

