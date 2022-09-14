// @ts-check

const express = require('express'); // express 프레임워크 불러오기

const server = express();
const PORT = 4000;

/* express의 기본기능(body-parser 모듈)
: Form에서 전송된 정보를 req.body에 담아서 obj로 전달해주는 역할 */
server.use(express.json()); // json형태로 데이터를 전달한다는 의미
server.use(express.urlencoded({ extended: false })); // url처럼 데이터를 변환하면 해당 데이터를 json 형태로 전달

const router = require('./routes/index');
const userRouter = require('./routes/users');
const boardRouter = require('./routes/board');

/* ROUTES */
server.use('/', router);
server.use('/users', userRouter); // users에 대한 routing은 이 곳에서 되고
server.use('/board', boardRouter);

server.set('view engine', 'ejs'); // 뷰엔진을 ejs로 쓴다.
server.set('views', 'views'); // 뷰엔진 파일은 views 폴더에 있다.
server.use(express.static('public'));

/* 에러 핸들링
- 무조건 서버실행 아래에 있어야 한다.
- 그래야 얻었던 라우터에서 에러가 발생했을 때 에러메세지를 발생시킴. */
server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  // 어디서 발생한 것인지는 모르겠지만 서버상의 문제이므로 err 객체에 statusCode 가 없으면 500을 띄우는 것
  res.end(err.message);
});

server.listen(PORT, () => {
  console.log(`Server On! The express server is running at port ${PORT}`);
});
