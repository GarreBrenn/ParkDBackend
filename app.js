var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var main = require("./testBlockchain")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testApiRouter = require("./routes/testAPI");
var app = express();

const mysql = require("mysql");
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const db = mysql.createConnection({
  host: 'localhost', // or change to public IP if using an SQL server on another computer
  user: 'root',
  password: '00098636', //not my phone password
  database: 'parkD'
});

app.use(cors());
main.main();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testApiRouter)
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
db.connect((error)=>{
  if(error){
      console.log("Error connecting :(");
  }
  else{
      console.log("Connected to MYSQL database!");
  }
})
app.use('/auth', require('./routes/auth'));


module.exports = app;
