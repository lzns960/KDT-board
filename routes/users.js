// @ts-check

const express = require('express');

const userRouter = express.Router();

const USER = [
  {
    id: 'tetz',
    name: '이효석',
    email: 'tetz@naver.com',
  },
  {
    id: 'test',
    name: '테스트맨',
    email: 'test@naver.com',
  },
];

userRouter.get('/', (req, res) => {
  const userLen = USER.length;
  res.render('users', { USER, userCounts: userLen, imgName: 'flower.gif' });

  /*  res.write('<h1>Hello, Dynamic Web page</h1>');
  for (let i = 0; i < USER.length; i++) {
    res.write(`<h2>USER id is ${USER[i].id}`);
    res.write(`<h2>USER name is ${USER[i].name}`);
  }
*/
});
// 그 뒤 경로에 대한 미들웨어는 아래 코드에서!
// userRouter.get('/', (req, res) => {
//   // '/users' 뒤에 붙는 주소 값들을 써주면 된다.
//   res.send(USER);
// });

userRouter.get('/:id', (req, res) => {
  const userData = USER.find((user) => user.id === req.params.id);
  if (userData) {
    res.send(userData);
  } else {
    const err = new Error('ID not found');
    err.statusCode = 404;
    throw err;
  }
});

userRouter.post('/', (req, res) => {
  // query로 들어오면 query, body로 들어면 body로 처리, 마지막 error 메세지
  if (Object.keys(req.query).length >= 1) {
    if (req.query.id && req.query.name && req.query.email) {
      const newUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };

      USER.push(newUser);
      res.redirect('/users');
    } else {
      const err = new Error('Unexpected Query');
      err.statusCode = 404;
      throw err;
    }
  } else if (req.body) {
    if (req.body.id && req.body.name && req.body.email) {
      const newUser = {
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
      };

      USER.push(newUser);
      res.redirect('/users');
    } else {
      const err = new Error('Unexpected Form data');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('No data');
    err.statusCode = 404;
    throw err;
  }
});

userRouter.put('/:id', (req, res) => {
  if (req.query.id && req.query.name && req.query.email) {
    const userData = USER.find((user) => user.id === req.params.id);
    if (userData) {
      const arrIndex = USER.findIndex((user) => user.id === req.params.id);
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
        email: req.query.email,
      };
      USER[arrIndex] = modifyUser;
      res.send('회원 정보 수정 완료');
    } else {
      const err = new Error('ID not found');
      err.statusCode = 404;
      throw err;
    }
  } else {
    const err = new Error('Unexpected Query');
    err.statusCode = 404;
    throw err;
  }
});

userRouter.delete('/:id', (req, res) => {
  const arrIndex = USER.findIndex((user) => user.id === req.params.id);
  if (arrIndex !== -1) {
    USER.splice(arrIndex, 1);
    res.send('회원 삭제 완료');
  } else {
    const err = new Error('ID not found');
    err.statusCode = 404;
    throw err;
  }
});

module.exports = userRouter;
