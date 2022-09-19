// @ts-check
const express = require('express');
const router = express.Router();
const mongoClient = require('./mongo');
const login = require('./login');

/* 글 전체 목록 보여주기 */
router.get('/', login.isLogin, async (req, res) => {
  console.log(req.user);
  const client = await mongoClient.connect();
  const cursor = client.db('Cluster-WeBlog').collection('board');
  const ARTICLE = await cursor.find({}).toArray();
  const articleLen = ARTICLE.length;
  res.render('board', {
    ARTICLE,
    articleCounts: articleLen,
    userId: req.session.userId
      ? req.session.userId
      : req.user?.id
      ? req.user?.id
      : req.signedCookies.id,
  });
});
/* 글 보기 모드로 이동 */
router.get('/show/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('Cluster-WeBlog').collection('board');
  const selectedArticle = await cursor.findOne({ title: req.params.title });
  res.render('board_show', { selectedArticle });
});
/* 글 쓰기 모드로 이동 */
router.get('/write', login.isLogin, (req, res) => {
  res.render('board_write');
});

/* 글 추가 기능 수행 */
router.post('/write', login.isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      id: req.session.userId ? req.session.userId : req.user.id,
      userName: req.user?.name ? req.user.name : req.user?.id,
      title: req.body.title,
      content: req.body.content,
    };

    const client = await mongoClient.connect();
    const cursor = client.db('Cluster-WeBlog').collection('board');
    await cursor.insertOne(newArticle);
    res.redirect('/board');
  }
});

/* 글 수정모드로 이동 */
router.get('/edit/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('Cluster-WeBlog').collection('board');
  const selectedArticle = await cursor.findOne({ title: req.params.title });
  res.render('board_edit', { selectedArticle });
});

/* 글 수정 기능 수행: 수정하기 눌렀을 때  */
router.post('/edit/title/:title', login.isLogin, async (req, res) => {
  if (req.body.title && req.body.content) {
    const client = await mongoClient.connect();
    const cursor = client.db('Cluster-WeBlog').collection('board');
    await cursor.updateOne(
      { title: req.params.title },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      }
    );
    res.redirect('board');
  } else {
    const err = new Error('요청 값이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

/* 글 삭제 기능 수행 */
router.delete('/delete/title/:title', login.isLogin, async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('Cluster-WeBlog').collection('board');
  const result = await cursor.deleteOne({ title: req.params.title });

  if (result.acknowledged) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 204;
    throw err;
  }
});

module.exports = router;
