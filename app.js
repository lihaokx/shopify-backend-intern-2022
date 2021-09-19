var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var config = require('./config');
var passport = require('passport');
const mongoose =require('mongoose');
mongoose.Promise = global.Promise;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var imageRouter = require('./routes/imageRouter');

const url = config.mongoUrl;
 
const connect = mongoose.connect(url,
  {
 
    autoIndex: true, //make this also true
} );
  connect.then((db) => {
    console.log("Connected correctly to server");
  }, (err) => { console.log(err); });
  
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/image', imageRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log("err: ",err.status)
 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.render('error'  );
  
});

module.exports = app;
