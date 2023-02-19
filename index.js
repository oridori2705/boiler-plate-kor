const express = require('express'); //다운받은 express 모듈을 가져옴
const app = express();// 함수를 이용해 새로운 express 앱을 만듦
const port = 5000; //포트는 아무렇게해도됨

const bodyParser = require("body-parser"); //다운받은 body-parser을 가져옴
const {User}= require("./models/User") //스키마 가져옴 app.post하기위해


const config=require("./config/key"); //비밀설정 : mongoURL를 깃허브에 못올리게 하도록 key 파일에서 배포 후 환경인지, 로컬환경인지 구분하고 URI를 가져온다.


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


//port 3000에 이 앱을 실행하는 것이다.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

