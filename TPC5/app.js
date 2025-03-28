var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose"); // Import mongoose
var alunosRouter = require('./routes/alunos');
var frontEndRouter = require('./routes/front');


var db = 'mongodb://localhost:27017/alunos';
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connection to the database established'))
  .catch(err => console.log(err));



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'pug'); // Set Pug as the view engine

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/front', frontEndRouter);
app.use('/alunos', alunosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
