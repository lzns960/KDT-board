// @ts-check
const express = require('express');
// express에서 제공하는 Router를 변수에 담기

const router = express.Router();

const mongoClient = require('./mongo');

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://suji:mtn191371wl@cluster0.s7lxybo.mongodb.net/?retryWrites=true&w=majority';

/* 글 전체 목록 보여주기 */
router.get('/', async (req, res) => {
  // await 붙은 순간은 이전에 다 callback으로 처리한 순간들이다.
  const client = await mongoClient.connect();
  // 데이터를 변화할 때 콜백을 걸어주면 되는 거니까 위치만 알려주는 정보만 넣어준다.(await 필요없음)
  const cursor = client.db('kdt1').collection('board');
  // 데이터가 받아지면 ARTICLE로 들어간다.
  const ARTICLE = await cursor.find({}).toArray();
  const articleLen = ARTICLE.length;
  res.render('board', { ARTICLE, articleCounts: articleLen });
});

/* 글 쓰기 모드로 이동 */
router.get('/write', (req, res) => {
  res.render('board_write');
});

/* 글 추가 기능 수행 */
router.post('/write', async (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      title: req.body.title,
      content: req.body.content,
    };

    // client에 접속에 관련된 정보를 가져온다.
    const client = await mongoClient.connect();
    // 접속을 바탕으로 db와 collection
    const cursor = client.db('kdt1').collection('board');
    // 데이터받는 시간이 걸리니까 await 걸어서 insertOne 추가
    await cursor.insertOne(newArticle);
    res.redirect('board');
  }
});

/* 글 수정모드로 이동 */
router.get('/modify/title/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  // title과 params의 타이틀이 동일하다면, 해당 데이터가 selectedArticle이 들어간다.
  const selectedArticle = await cursor.findOne({ title: req.params.title });
  res.render('board_edit', { selectedArticle });
});

/* 글 수정 기능 수행: 수정하기 눌렀을 때  */
router.post('/modify/title/:title', async (req, res) => {
  if (req.body.title && req.body.content) {
    const client = await mongoClient.connect();
    const cursor = client.db('kdt1').collection('board');
    // title이 params의 title과 같다면,
    await cursor.updateOne(
      { title: req.params.title },
      // req.body와 동일하게 바꿈
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      }
    );
    res.redirect('/board');
  } else {
    const err = new Error('요청 값이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

/* 글 삭제 기능 수행 */
router.delete('/delete/title/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const result = await cursor.deleteOne({ title: req.params.title });

  // 에러메세지: result 객체가 승인되었는지 ?? acknowledgend가 true면
  if (result.acknowledged) {
    // redirect를 쓰면 delete 메소드로 더 들어가기 때문에 res.send로 끝내준다.
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 204;
    throw err;
  }
});

module.exports = router;
