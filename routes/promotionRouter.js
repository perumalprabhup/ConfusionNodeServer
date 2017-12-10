const express = require("express");
const bodyParser = require("body-parser");
const mongoose =require("mongoose");
const Promotions =require('../model/promotions');
const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
promotionRouter.route('/')
.get((req,res,next)=>{
	Promotions.find({})
	.then((promotion)=>{
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
	},(err)=>next(err)).catch((err)=>next(err))
	
})

.post((req,res,next)=>{
	Promotions.create(req.body)
	.then((promotion)=>{
		console.log('Promotion Created',promotion);
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
	},(err)=>next(err)).catch((err)=>next(err));
})
.put((req,res,next)=>{
	res.statusCode = 403;
	res.end("No Update Operation Supported in promotion");	
	
})
.delete((req,res,next)=>{
	Promotions.remove()
	.then((promotion)=>{
		console.log('Promotion Created',promotion);
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
	},(err)=>next(err)).catch((err)=>next(err));
	 
	
});

promotionRouter.route('/:promotionId')

.get ((req,res,next)=>{
	Promotions.findById(req.params.promotionId)
	.then((promotion)=>{
		console.log("promotion Id",promotion);
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
	},(err)=>next(err)).catch((err)=>next(err))
	
})

.post((req,res,next)=>{
	res.statusCode = 403;
	res.end("Post is not Supported in Promotion: "+req.params.promotionId);	
	
})

.put((req,res,next)=>{
	
		Promotions.findByIdAndUpdate(req.params.promotionId,{
			$set:req.body
		},{new:true})
	.then((promotion)=>{
		console.log("promotion Id",promotion);
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
	},(err)=>next(err)).catch((err)=>next(err))
	
 
})

.delete((req,res,next)=>{
		Promotions.findByIdAndRemove(req.params.promotionId )
	.then((promotion)=>{
		console.log("promotion Id",promotion);
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
	},(err)=>next(err)).catch((err)=>next(err))
	
});


promotionRouter.route('/:promotionId/comments')
.get((req,res,next)=>{
	Promotions.findById(req.params.promotionId)
	.then((promotion)=>{
		if(promotion !=null){
			res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion.comments);
		}
		else{
			err = new Error('Promotion '+req.params.promotionId+' not Found');
			err.status = 404;
			return next(err);
		}
		
	},(err)=>next(err)).catch((err)=>next(err))
	
})

.post((req,res,next)=>{
	Promotions.findById(req.params.promotionId)
	.then((promotion)=>{
		if(promotion !=null){
			promotion.comments.push(req.body)
			promotion.save()
			.then((promotion)=>{
			 
			res.statusCode = 200;
			res.setHeader("Content-Type","application/json");
			res.json(promotion);		
			},(err)=>next(err));
		}
		else{
			err = new Error('Promotion '+req.params.promotionId+' not Found');
			err.status = 404;
			return next(err);
		}
		
	},(err)=>next(err)).catch((err)=>next(err));
})
.put((req,res,next)=>{
	res.statusCode = 403;
	res.end("No Update Operation Supported in promotion");	
	
})
.delete((req,res,next)=>{
	Promotions.findById(req.params.promotionId)
	.then((promotion)=>{
		if(promotion !=null){
			for (var i=(promotion.comments.length-1);i>=0;i--){
				promotion.comments.id(promotion.comments[i]._id).remove();
			}
			promotion.save()
			.then((promotion)=>{
				 
					console.log('Promotion Created',promotion);
				res.statusCode = 200;
				res.setHeader("Content-Type","application/json");
				res.json(promotion);
	 
			},(err)=>next(err));
		}
			else {
		err = new Error('Promotion '+req.params.prommotionId+' not Found');
		
		err.status = 404;
		return next(err);
	}
		
	},(err)=>next(err)).catch((err)=>next(err));
	 
	
});

promotionRouter.route('/:promotionId/comments/:commentId')

.get ((req,res,next)=>{
	Promotions.findById(req.params.promotionId)
	.then((promotion)=>{
		if(promotion!=null && promotion.comments.id(req.params.promotionId)){
	
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion.comments.id(req.params.promotionId));
		
		}
		else{
		err = new Error('Comment '+req.params.commentId+' not Found');
		
		err.status = 404;
		return next(err);
	}
	
		},(err)=>next(err)).catch((err)=>next(err))
	
})

.post((req,res,next)=>{
	res.statusCode = 403;
	res.end("Post is not Supported in Promotion: "+req.params.promotionId);	
	
})

.put((req,res,next)=>{
	
		Promotions.findById(req.params.promotionId)
	.then((promotion)=>{
		if(promotion !=null && promotion.comments.id(req.params.comments)!=null){
			
		
		if(req.body.rating)
		{
			promotion.comments.id(req.params.commentId).rating =req.body.rating;
		}
		if(req.body.comment){
			promotion.comments.id(req.params.commentId).comment = req.body.comment;
		}
		promotion.save()
		.then((promotion)=>{
			console.log("promotion Id",promotion);
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
		})
		}
		else if (promotion == null) {
		err = new Error('Promotion '+req.params.promotionId+' not Found');
		
		err.status = 404;
		return next(err);
	}
	else{
		err = new Error('Comment '+req.params.commentId+' not Found');
		
		err.status = 404;
		return next(err);
	}
		
	},(err)=>next(err)).catch((err)=>next(err))
	
 
})

.delete((req,res,next)=>{
		Promotions.findById(req.params.promotionId)
	.then((promotion)=>{
		if(promotion !=null && promotion.comments.id(req.params.commentId) !=null){
			promotion.comments.id(req.params.commentId).remove();
			promotion.save()
			,then((promotion)=>{
					 
		res.statusCode = 200;
		res.setHeader("Content-Type","application/json");
		res.json(promotion);
				
			},(err)=>next(err)).catch((err)=>next(err))
			
		}
		else if (promotion == null) {
		err = new Error('Promotion '+req.params.promotionId+' not Found');
		
		err.status = 404;
		return next(err);
	}
	else{
		err = new Error('Comment '+req.params.commentId+' not Found');	
		err.status = 404;
		return next(err);
	}
	
	},(err)=>next(err)).catch((err)=>next(err))
	
});


module.exports = promotionRouter;