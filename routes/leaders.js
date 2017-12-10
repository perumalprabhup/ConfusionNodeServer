const express = require('express');
const bodyparser =require('body-parser');
const leaderRouter = express.Router();

 leaderRouter.use(bodyparser.json());
 leaderRouter.route('/')
 
 .all((req,res,next)=>{
	 res.statusCode =200;
	 res.setHeader('Content-Type','text/plain');
	 next();
	 
 })
 .get((req,res,next)=>{
	 res.end('Get your Leader');
	 
 })
 .post((req,res,next)=>{
	 res.end("will add the details of leader name :"+req.body.name+" with role :"+req.body.role);
 })
 .put((req,res,next)=>{
	 res.statusCode = 400;
	 res.end("No Update Operation Done With Leader");
 })
 .delete((req,res,next)=>{
	 res.end("leader deleted successully");
 });
 
 leaderRouter.route('/leader/:leaderId')
 

 .get((req,res,next)=>{
	 res.end('Get your Leader id :'+req.params.leaderId);
	 
 })
 .post((req,res,next)=>{
	 res.statusCode = 400;
	 res.end("No Post Operation Done With Leader");
 })
 .put((req,res,next)=>{
	 
	 res.write("Updating Leader Id :"+req.params.leaderId );
	 res.end("update the details of leader name :"+req.body.name+" with role :"+req.body.role);
 })
 .delete((req,res,next)=>{
	 res.end("leader deleted successully");
 });
 
 module.exports = leaderRouter;