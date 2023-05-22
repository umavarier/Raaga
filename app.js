const express = require('express')
const userrouter = require('./server/router/user-router')
const adminrouter = require('./server/router/admin-router')
const db = require('./server/database/db')
const session = require('express-session')
const path = require('path')
const MongoStore = require('connect-mongo')

const app = express();

app.use(function (req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

const sessionStorage = MongoStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/RaagaDataBase",
  dbName: 'RaagaDataBase',
  collectionName: 'storeSession'
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "./public")));

app.set('view engine', 'ejs');

app.use('/uploads', express.static('uploads'))
const oneWeek = 60 * 60 * 24 * 7
app.use(session({
  secret: "thisisthesecretkeyofsession",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneWeek },
  store: sessionStorage
}))

app.use('/admin', adminrouter)
app.use('/', userrouter)

app.listen(3000, () => { console.log("server running at port 3000") })