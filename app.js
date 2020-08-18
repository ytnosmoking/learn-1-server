var createError = require('http-errors');
var express = require('express');
const session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectMongo = require('connect-mongo')
require('./db')
const router = require('./routes')
const config = require('./config')

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.set('superSecret', config.jwt)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//  使用 mongo 缓存
const MongoStore = connectMongo(session)
app.use(session({
  ...config.session,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    url: config.url
  })
}))
app.use(express.static(path.join(__dirname, 'public')));

router(app)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
