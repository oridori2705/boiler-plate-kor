const express = require('express'); //다운받은 express 모듈을 가져옴
const app = express();// 함수를 이용해 새로운 express 앱을 만듦
const port = 5000; //포트는 아무렇게해도됨

//오류 1. useCreateIndex: true, useFindAndModify :false : 이거 몽구스 6버전 이상은 안적어도 됨
//오류 2.  DeprecationWarning: Mongoose: the `strictQuery` : 이거는 mongoose.set('strictQuery', true); 추가해서 없애면됨 ->버전 상승으로인해 필수 조건
//몽구스 모듈 가져오기
const mongoose =require('mongoose');
mongoose.set('strictQuery', true);
//몽구스 연결하기 -> 아이디 뒤에 <password> 부분  내 비밀번호로 바꿔서 넣기
//useNewUrlParser:true, useUnifiedTopology : true : 오류 없애주는 거임
//then : 연결 성공하면 , catch : 오류뜨면
mongoose.connect("mongodb+srv://oridori2705:abcd1234@node-test.of25qpt.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true, useUnifiedTopology : true
}).then(()=>console.log("good")).catch(err=>console.log(err))

//root 디렉토리에 hello world를 출력되게 해줌
app.get('/', (req, res) => {
  res.send('Hello World!')
})
//port 3000에 이 앱을 실행하는 것이다.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

