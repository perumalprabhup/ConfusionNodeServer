var express = require('express');
var bodyParser = require ('body-parser');
var User =require('../model/user');
 
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) =>{
  res.send('respond with a resource');
});
router.post('/signUp', function(req, res, next) {
  User.findOne({userName:req.body.userName})
  .then((user)=>{
	  if(user!=null){
		  var err= new Error('User '+req.body.userName+' already Exist');
		  err.status = 403;
		  next(err);
	  }
	  else{
		  return User.create({
			  userName:req.body.userName,
			  password:req.body.password
		  });
	  }
  },(err)=>next(err))
  .then((user)=>{
	  res.statusCode = 200;
	  res.setHeader('Content-Type','application/json');
	  res.json({status:'Registration Successful',user:user});
	  
  }).catch((err)=>next(err));
});

router.post('/login',(req,res,next)=>{
		if(!req.session.user){
		
	console.log(req.headers);
	var authHeader = req.headers.authorization;
	if(!authHeader){
		var err = new Error('You are not Authenticated !!');
		res.setHeader('WWW-Authenticate','Basic');
		err.status = 401;
		return next(err);
	}
	var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
	var userName = auth[0];
	var password = auth[1];
	
	 User.findOne({userName:userName})
		.then((user)=>{
			if(user.userName === userName && user.password ===password){
				
				req.session.user = 'authenticated';
				res.statusCode = 200;
				res.setHeader('Content-Type','text/plain')
				res.end('user Authenticated');
				 
		
			}
			else if(user.password !==password){
				var err = new Error('Your Password is Incorrect');
				err.status = 403;
				return next(err);
				 
			}
			else if(user === null){
				var err = new Error('User Name '+user.userName+' doesn\'t Exist');
				err.status = 403;
				return next(err);
			}
		})
	.catch((err)=>next(err));
	}
	
	else{
		res.statusCode =200;
		res.setHeader('Content-Type','text/plain');
		res.end("you are already Authenticated!")
	}
	
})

router.get('/logout',(req,res,next)=>{
	if(req.session){
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	}
	else{
		var err = new Error('You are not logged in');
		err.status =403;
		return next(err);
	}
})
module.exports = router;
