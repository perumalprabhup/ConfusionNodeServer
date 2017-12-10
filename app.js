var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require ('express-session');
var FileStore = require ('session-file-store')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter =require ('./routes/dishRouter');
var promotionRouter =require ('./routes/promotionRouter');
var leaderRouter =require ('./routes/leaders');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Dishes =require('./model/dishes');
var Promotions =require('./model/promotions');

var url = 'mongodb://localhost:27017/Prabhu';
var connect = mongoose.connect(url,{
	useMongoClient:true
});

connect.then((db)=>{
	console.log('Conneced Successfully to Server');
},(err)=>{console.log(err);});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
app.use(session({
	name :'session-id',
	secret :'98765-pqrst-54321-344567',
	saveUninitilized:false,
	resave:false,
	store: new FileStore()
}));

app.use('/', index);
app.use('/users', users);

function auth(req,res,next){
	console.log(req.session);
	
	if(!req.session.user){
 
		var err = new Error('You are not Authenticated !!');
		err.status = 403;
		return next(err);
  
	}
	else{
		if(req.session.user === 'authenticated'){
			next();
		}
		else{
			var err = new Error('You are not Authenticated !!'); 
			err.status = 403;
			return next(err);
		}
	}
	
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));



app.use("/dishes",dishRouter);

app.use("/leader",leaderRouter);
app.use("/promotions",promotionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
