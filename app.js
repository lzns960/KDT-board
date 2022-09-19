// @ts-check

const express = require('express'); // express 프레임워크 불러오기
const cookieParser = require('cookie-parser'); /* 쿠키 파서 */
const session = require('express-session'); /* 세션 모듈 추가 및 미들웨어 연결 */
const passport = require('passport'); /* PASSPORT 모듈 */
require('dotenv').config(); /* DOTENV 중요 정보 관리 모듈 */

const app = express();
const PORT = process.env.PORT;

/* express의 기본기능(body-parser 모듈)
: Form에서 전송된 정보를 req.body에 담아서 obj로 전달해주는 역할 */
app.use(express.json()); // json형태로 데이터를 전달한다는 의미
app.use(express.urlencoded({ extended: false })); // url처럼 데이터를 변환하면 해당 데이터를 json 형태로 전달
/* 쿠키파서 */
app.use(cookieParser('suji')); // 암호화된 쿠키만들기: 쿠키파서에서 키 값을 입력하면 암호화!
/* 세션 */
app.use(
  session({
    secret: 'suji', // 문자열을 통해서 암호화
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
/* 패스포트 */
app.use(passport.initialize());
app.use(passport.session());

/* 사용자 모듈들 */
const router = require('./routes/index');
const boardRouter = require('./routes/board');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const passportRouter = require('./routes/passport');
passportRouter();

/* ROUTES */
app.use('/', router);
app.use('/board', boardRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter.router); // loginRouter = { router, isLogin}이기 때문에 .router를 사용하여 미들웨어만 불러준다.

/* 뷰엔진 세팅 */
app.set('view engine', 'ejs'); // 뷰엔진을 ejs로 쓴다.
app.set('views', 'views'); // 뷰엔진 파일은 views 폴더에 있다.

app.use(express.static('public')); // 브라우저에서 접근 가능한 폴더위치 지정

/* 에러 핸들링
- 무조건 서버실행 아래에 있어야 한다.
- 그래야 얻었던 라우터에서 에러가 발생했을 때 에러메세지를 발생시킴. */
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  // 어디서 발생한 것인지는 모르겠지만 서버상의 문제이므로 err 객체에 statusCode 가 없으면 500을 띄우는 것
  res.end(err.message);
});

app.listen(PORT, () => {
  console.log(`Server On! The express server is running at port ${PORT}`);
});
