const passport = require('passport');
/* 전략- Local, naver */
const LocalStrategy = require('passport-local').Strategy;
const NaverStrategy = require('passport-naver').Strategy;

const mongoClient = require('./mongo');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'password',
      },
      async (id, password, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('Cluster-WeBlog').collection('users');
        // id 중복여부 체크
        const idResult = await userCursor.findOne({ id });
        if (idResult !== null) {
          if (idResult.password === password) {
            cb(null, idResult);
          } else {
            cb(null, false, { message: '해당 비밀번호가 없습니다.' });
          }
        } else {
          cb(null, false, { message: '해당 id가 없습니다.' });
        }
      }
    )
  );
  passport.use(
    new NaverStrategy( // 인증처리하는 곳이 어디있는지 옵션값으로 전달
      {
        clientID: process.env.NAVER_CLIENT,
        clientSecret: process.env.NAVER_CLIEN_SECRET,
        callbackURL: process.env.NAVER_CB_URL,
      },
      async (accessToken, refreshToken, profile, cb) => {
        const client = await mongoClient.connect();
        const userCursor = client.db('Cluster-WeBlog').collection('users');
        const result = await userCursor.findOne({ id: profile.id });
        if (result !== null) {
          cb(null, result);
        } else {
          // sns 로그인 처음
          const newNaverUser = {
            id: profile.id,
            name:
              profile.displayName !== undefined
                ? profile.displayName
                : profile.emails[0].value,
            provider: profile.provider,
          };
          const dbResult = await userCursor.insertOne(newNaverUser);
          if (dbResult.acknowledged) {
            cb(null, newNaverUser);
          } else {
            cb(null, false, { message: '회원 생성 에러' });
          }
        }
      }
    )
  );
  // 로그인이 성공되면 serializeUser의 user 매개변수로 담긴다
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  // deserializeUser는 서버와 통신해야하기때문에 async 필요
  // deserializeUser의 id는 serializeUser에서 넘긴 것
  // 사용자가 다른 페이지로 이동하려고 할때마다 체크
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
};
