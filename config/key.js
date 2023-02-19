if(process.env.NODE_ENV=="production"){ //process.env.NODE_ENV 는 로컬환경이면 "development", 배포한 후면 "production"을 반환한다.
    module.exports= require('./prod'); //배포 후 환경이면 prod 파일로 가서 mongoURI를 가져온다
}else{
    module.exports=require("./dev"); //로컬환경이면 .gitignore한 파일인 dev.js를 가져온다. 이로써 비밀설정이 된다.
}