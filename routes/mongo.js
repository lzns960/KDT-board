// @ts-check
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://suji:mtn191371wl@cluster0.s7lxybo.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;
