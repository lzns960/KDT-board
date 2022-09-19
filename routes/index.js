// @ts-check

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { popup: req.cookies.popup }); // 인덱스가 보내질 때 쿠키정보가 같이 들어가게 popup에!
});

router.post('/cookie', (req, res) => {
  res.cookie('popup', 'hide', {
    // 팝업이라는 쿠키 내부에 hide 값, 쿠키 옵션
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24시간
    httpOnly: true,
  });
  res.send('쿠키 생성 성공');
});

module.exports = router;
